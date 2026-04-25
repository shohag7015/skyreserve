$port = 8080
$tcpConnections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($tcpConnections) {
    foreach ($conn in $tcpConnections) {
        $processId = $conn.OwningProcess
        if ($processId -ne 0 -and $processId -ne 4) {
            Write-Output "Killing process $processId on port $port"
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
}
Write-Output "Starting backend..."
Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -RedirectStandardOutput "backend.log" -RedirectStandardError "backend_err.log"
