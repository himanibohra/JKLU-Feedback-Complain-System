$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:8080/api"
$email = "testuser_$(Get-Random)@example.com"
$password = "password123"

Write-Host "1. Registering User..." -ForegroundColor Cyan
try {
    $registerBody = @{
        name     = "Test User"
        email    = $email
        password = $password
        role     = "student"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
    Write-Host "   Success: $($registerResponse.msg)" -ForegroundColor Green
}
catch {
    Write-Host "   Registration failed (might already exist): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n2. Logging in..." -ForegroundColor Cyan
$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token
Write-Host "   Login Successful. Token received." -ForegroundColor Green

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "`n3. Fetching Categories..." -ForegroundColor Cyan
$categories = Invoke-RestMethod -Uri "$baseUrl/complaints/categories" -Method Get -Headers $headers
Write-Host "   Raw Categories Response: $($categories | ConvertTo-Json -Depth 2)" -ForegroundColor Gray

if ($categories -is [System.Array]) {
    Write-Host "   Found $( $categories.Count ) categories." -ForegroundColor Green
}
else {
    Write-Host "   Found single category object." -ForegroundColor Green
    $categories = @($categories)
}

if ($categories.Count -eq 0) {
    Write-Error "No categories found! Cannot create complaint."
}
$categoryId = $categories[0].category_id
Write-Host "   Using Category ID: $categoryId" -ForegroundColor Gray

Write-Host "`n4. Creating Complaint..." -ForegroundColor Cyan
$complaintBody = @{
    title        = "Test Complaint via Script"
    description  = "This is a test complaint created by the automation script."
    category_id  = $categoryId
    location     = "Library"
    priority     = "medium"
    is_anonymous = $false
} | ConvertTo-Json

$complaintResponse = Invoke-RestMethod -Uri "$baseUrl/complaints" -Method Post -Headers $headers -ContentType "application/json" -Body $complaintBody
Write-Host "   Success: $($complaintResponse.msg)" -ForegroundColor Green
$complaintId = $complaintResponse.complaint_id

Write-Host "`n5. Fetching My Complaints..." -ForegroundColor Cyan
$myComplaints = Invoke-RestMethod -Uri "$baseUrl/complaints" -Method Get -Headers $headers
Write-Host "   Retrieved $( $myComplaints.Count ) complaints." -ForegroundColor Green
$found = $myComplaints | Where-Object { $_.complaint_id -eq $complaintId }

if ($found) {
    Write-Host "   Verified: Created complaint found in list." -ForegroundColor Green
}
else {
    Write-Error "   Failed: Created complaint NOT found in list."
}

Write-Host "`nAPI Testing Completed Successfully!" -ForegroundColor Magenta
