import urllib.parse
from app.schemas.scan import UrlFindingModel
from app.url_analyzer.ssrf import is_url_ssrf_safe

SHORTENER_DOMAINS = {"bit.ly", "tinyurl.com", "t.me", "wa.me", "rb.gy", "is.gd", "cutt.ly", "ow.ly"}
REGULATOR_KEYWORDS = ["sebi", "nse", "bse", "rbi", "nsdl", "cdsl", "incometax"]
CREDENTIAL_KEYWORDS = ["login", "signin", "auth", "payment", "deposit", "wallet", "claim", "bonus", "rewards", "vip"]

def analyze_url(raw_url: str) -> UrlFindingModel:
    clean_url = raw_url.strip()
    if not clean_url.startswith("http://") and not clean_url.startswith("https://"):
        clean_url = "https://" + clean_url

    parsed = urllib.parse.urlparse(clean_url)
    hostname = (parsed.hostname or "invalid-url").lower()
    pathname = (parsed.path or "").lower()
    query = (parsed.query or "").lower()
    full_str = f"{hostname}{pathname}?{query}"

    is_https = parsed.scheme.lower() == "https"
    has_ip_address = False
    try:
        import ipaddress
        ipaddress.ip_address(hostname)
        has_ip_address = True
    except ValueError:
        has_ip_address = False

    is_punycode = hostname.startswith("xn--") or ".xn--" in hostname
    is_shortener = any(hostname == s or hostname.endswith("." + s) for s in SHORTENER_DOMAINS)

    has_regulator_keywords = any(kw in full_str for kw in REGULATOR_KEYWORDS)
    is_official_regulator = hostname.endswith("sebi.gov.in") or hostname.endswith("nseindia.com") or hostname.endswith("bseindia.com") or hostname.endswith("rbi.org.in")
    brand_mismatch = has_regulator_keywords and not is_official_regulator

    has_apk = pathname.endswith(".apk") or "download" in full_str or "apk" in full_str
    has_payment_or_login = any(kw in full_str for kw in CREDENTIAL_KEYWORDS)

    risk_flags = []
    if not is_https:
        risk_flags.append("Insecure plain HTTP protocol (no TLS encryption). Note: HTTPS alone does NOT verify safety.")
    if has_ip_address:
        risk_flags.append("Direct IP address used as website host, obscuring legal domain registration.")
    if is_punycode:
        risk_flags.append("Punycode / internationalized character spoofing detected in domain string.")
    if is_shortener:
        risk_flags.append("URL shortener used to conceal final destination endpoint.")
    if brand_mismatch:
        risk_flags.append("URL contains SEBI/NSE regulatory keywords, but is hosted on an unverified third-party domain.")
    if has_apk:
        risk_flags.append("Direct link pointing to an installable Android package (.apk) bypassing official app marketplaces.")
    if has_payment_or_login and brand_mismatch:
        risk_flags.append("Credential or money deposit collection form hosted on an unverified domain.")

    # Check SSRF safety
    is_safe, ssrf_reason = is_url_ssrf_safe(clean_url)
    if not is_safe:
        risk_flags.append(f"SSRF Alert: {ssrf_reason}")

    parts = hostname.split(".")
    registrable = ".".join(parts[-2:]) if len(parts) >= 2 else hostname

    return UrlFindingModel(
        url=raw_url,
        isHttps=is_https,
        domain=hostname,
        registrableDomain=registrable,
        hasIpAddress=has_ip_address,
        isPunycode=is_punycode,
        isShortener=is_shortener,
        hasRegulatorKeywords=has_regulator_keywords,
        hasApkOrDownload=has_apk,
        hasPaymentOrLoginKeywords=has_payment_or_login,
        brandMismatch=brand_mismatch,
        riskFlags=risk_flags
    )
