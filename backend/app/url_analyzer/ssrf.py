import ipaddress
import urllib.parse

BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),      # Loopback
    ipaddress.ip_network("10.0.0.0/8"),       # Private RFC 1918
    ipaddress.ip_network("172.16.0.0/12"),    # Private RFC 1918
    ipaddress.ip_network("192.168.0.0/16"),   # Private RFC 1918
    ipaddress.ip_network("169.254.0.0/16"),   # Link-local / AWS metadata
    ipaddress.ip_network("0.0.0.0/8"),        # Current network
    ipaddress.ip_network("::1/128"),          # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),         # IPv6 private
    ipaddress.ip_network("fe80::/10"),        # IPv6 link-local
]

def is_url_ssrf_safe(url: str) -> tuple[bool, str]:
    """
    Validates whether a URL is safe from SSRF hazards before any potential network fetch.
    Returns (is_safe, reason).
    """
    try:
        parsed = urllib.parse.urlparse(url)
    except Exception as e:
        return False, f"Invalid URL parsing: {e}"

    if parsed.scheme.lower() not in ["http", "https"]:
        return False, f"Prohibited URL scheme '{parsed.scheme}'. Only http and https permitted."

    hostname = (parsed.hostname or "").lower().strip()
    if not hostname:
        return False, "Missing hostname in URL."

    if hostname in ["localhost", "127.0.0.1", "0.0.0.0", "::1"]:
        return False, "Rejection: Localhost and loopback hostnames prohibited."

    # Check if host is direct IP address
    try:
        ip_obj = ipaddress.ip_address(hostname)
        for net in BLOCKED_IP_NETWORKS:
            if ip_obj in net:
                return False, f"Rejection: Target IP address {ip_obj} falls within private or link-local range."
    except ValueError:
        # Hostname is a domain name, not a raw IP address
        pass

    return True, "URL passes SSRF safety filtering."
