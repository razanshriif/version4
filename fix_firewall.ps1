# ─────────────────────────────────────────
# Lumière Logistique — Firewall Fix Script
# ─────────────────────────────────────────
# Purpose: Open Port 8090 for Mobile Access
# Instructions:
# 1. Right-click this file -> "Run with PowerShell"
# 2. Or open PowerShell as Administrator and run:
#    .\fix_firewall.ps1
# ─────────────────────────────────────────

$port = 8090
$ruleName = "Lumiere Backend (8090)"

Write-Host "Checking if Firewall Rule '$ruleName' exists..." -ForegroundColor Cyan

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($existing) {
    Write-Host "Rule already exists. Replacing it to ensure correct settings..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName $ruleName
}

try {
    New-NetFirewallRule -DisplayName $ruleName `
                        -Direction Inbound `
                        -Action Allow `
                        -Protocol TCP `
                        -LocalPort $port `
                        -Description "Allow mobile devices to connect to the Lumiere Backend API." `
                        -Group "Lumiere Development"
    
    Write-Host "`n✅ SUCCESS: Port $port is now OPEN for incoming connections." -ForegroundColor Green
    Write-Host "Dashboard and mobile devices should now be able to reach your PC." -ForegroundColor Green
}
catch {
    Write-Host "`n❌ ERROR: Failed to add firewall rule." -ForegroundColor Red
    Write-Host "Please ensure you are running this Script as ADMINISTRATOR." -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)"
}

Write-Host "`nPress any key to exit..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
