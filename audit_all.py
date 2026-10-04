"""
SANGYAN SHIELD - Unified System Audit & Verification Suite
Audits Frontend, Backend, and Machine Learning modules for zero errors.
"""

import sys
import os
import subprocess
import time

def print_banner(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def run_step(step_name, command, cwd=None):
    print(f"\n[RUNNING] {step_name}...")
    start = time.time()
    res = subprocess.run(command, cwd=cwd, shell=True, capture_output=True, text=True)
    duration = time.time() - start
    if res.returncode == 0:
        print(f"[PASS] {step_name} completed in {duration:.2f}s")
        return True, res.stdout
    else:
        print(f"[FAIL] {step_name} failed (exit code {res.returncode})")
        if res.stdout:
            print("STDOUT:\n", res.stdout[-1000:])
        if res.stderr:
            print("STDERR:\n", res.stderr[-1000:])
        return False, res.stderr or res.stdout

def main():
    print_banner("SANGYAN SHIELD - FULL SYSTEM AUDIT (FRONTEND, BACKEND, ML)")
    root_dir = os.path.abspath(os.path.dirname(__file__))
    all_passed = True
    results = []

    # 1. Audit ML Pipeline Tests
    passed, out = run_step(
        "ML Unit & Integration Tests (15 tests)",
        "python -m pytest ml/tests/ -v",
        cwd=root_dir
    )
    results.append(("ML Pytest Suite (15/15)", passed))
    if not passed:
        all_passed = False

    # 2. Audit Backend Risk Engine Logic
    passed, out = run_step(
        "Backend Risk Engine Security & Logic (7/7 tests)",
        "python backend/tests/test_risk_engine.py",
        cwd=root_dir
    )
    results.append(("Backend Risk Engine (7/7)", passed))
    if not passed:
        all_passed = False

    # 3. Audit ML Inference Pipeline & Calibration
    passed, out = run_step(
        "ML Pipeline & Scorer Integration (7/7 tests)",
        "python backend/tests/test_ml_pipeline.py",
        cwd=root_dir
    )
    results.append(("ML Inference & Calibration (7/7)", passed))
    if not passed:
        all_passed = False

    # 4. Audit Frontend Linter
    frontend_dir = os.path.join(root_dir, "frontend")
    passed, out = run_step(
        "Frontend Code Quality & Linter (0 warnings, 0 errors)",
        "npm run lint",
        cwd=frontend_dir
    )
    results.append(("Frontend Linter (oxlint)", passed))
    if not passed:
        all_passed = False

    # 5. Audit Frontend TypeScript & Production Build
    passed, out = run_step(
        "Frontend TypeScript Compilation & Vite Production Bundle",
        "npm run build",
        cwd=frontend_dir
    )
    results.append(("Frontend Build (tsc -b && vite build)", passed))
    if not passed:
        all_passed = False

    # 6. Audit FastAPI Endpoints with Live TestClient
    fastapi_test_cmd = (
        'python -c "'
        'import sys, os; sys.path.insert(0, os.path.abspath(\'backend\')); '
        'from fastapi.testclient import TestClient; from app.main import app; '
        'client = TestClient(app); '
        'assert client.get(\'/api/health\').status_code == 200; '
        'assert client.post(\'/api/scan/text\', json={\'text\': \'Guaranteed 30% monthly return. Send OTP now!\', \'language\': \'en\'}).status_code == 200; '
        'assert client.post(\'/api/scan/url\', json={\'url\': \'https://hdfc-free-bonus.apk-download.com\'}).status_code == 200; '
        'assert client.post(\'/api/verify/entity\', json={\'name\': \'Zerodha Broking Limited\', \'registration_number\': \'INZ000031633\'}).status_code == 200; '
        'assert client.get(\'/api/ml/metrics\').status_code == 200; '
        'assert client.post(\'/api/ml/analyze\', json={\'text\': \'Guaranteed return\'}).status_code == 200; '
        'assert client.post(\'/api/ml/predict\', json={\'text\': \'Guaranteed return\'}).status_code == 200; '
        'assert client.get(\'/api/education\').status_code == 200; '
        'assert client.post(\'/api/feedback\', json={\'scan_id\': \'1\', \'feedback_type\': \'helpful\'}).status_code == 200; '
        'print(\'FastAPI TestClient: All 9 Endpoints Verified Successfully\')"'
    )
    passed, out = run_step(
        "FastAPI Full API Endpoints (9/9 endpoints)",
        fastapi_test_cmd,
        cwd=root_dir
    )
    results.append(("FastAPI Endpoints (9/9)", passed))
    if not passed:
        all_passed = False

    # Print Summary Table
    print_banner("AUDIT SUMMARY REPORT")
    for name, status in results:
        status_str = "PASSED [OK]" if status else "FAILED [X]"
        print(f"  {name:<50} {status_str}")
    print("-" * 70)

    if all_passed:
        print("\nSUCCESS: All components (Frontend, Backend, and ML) passed with 0 errors!\n")
        return 0
    else:
        print("\nFAILURE: One or more components failed audit. Please check logs above.\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
