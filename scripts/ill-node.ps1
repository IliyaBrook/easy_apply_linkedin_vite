# kill-node.ps1 — Завершает все процессы Node.js в Windows
Write-Output "Завершаем все процессы Node.js..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Output "Все процессы Node.js завершены."
