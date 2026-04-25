$ErrorActionPreference = "Stop"
try {
    $passenger = @{
        firstName = "A"
        lastName = "B"
        email = "a@a.com"
        phone = "123"
        passportNo = "123"
        nationality = "X"
        dateOfBirth = "2000-01-01"
    } | ConvertTo-Json

    $pResponse = Invoke-RestMethod -Uri "http://localhost:8080/passenger/" -Method Post -ContentType "application/json" -Body $passenger
    Write-Output "Passenger saved:"
    Write-Output ($pResponse | ConvertTo-Json)

    $booking = @{
        flightId = 1
        bookingStatus = "PENDING"
        totalFare = 1500.00
        classType = "ECONOMY"
        userId = 1
        noOfPassengers = 1
        passengers = @($pResponse)
    } | ConvertTo-Json

    $bResponse = Invoke-RestMethod -Uri "http://localhost:8080/booking/" -Method Post -ContentType "application/json" -Body $booking
    Write-Output "Booking saved:"
    Write-Output ($bResponse | ConvertTo-Json)
} catch {
    Write-Output "ERROR occurred:"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Output $reader.ReadToEnd()
    } else {
        Write-Output $_.Exception.Message
    }
}
