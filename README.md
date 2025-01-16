# QLO_Demo Setup Guide

## References

[Django & React (TechWithTim)](https://www.youtube.com/watch?v=c-QsfbznSXI)  
[React Redux Authentication (DaveGray)](https://www.youtube.com/watch?v=-JJFQ9bkUbo)

## Python/Django/Server Setup

### Create virtual environment - In the root dir run:

`python -m venv env`

### Activate the env:

Windows: `env/Scripts/activate`  
Mac: `env/bin/activate`

### CD to server dir:

`cd server`

### Install Python dependencies:

`pip install -r requirements.txt`

### Run Django migrate:

`py manage.py migrate`

### Create a .env file

_Replace yourTokenHere with your tokens, Google token must have Maps JavaScript API, Routes API & Geocoding API enabled_  
Windows (Powershell):  
`Set-Content -Path .env -Value "DWAVELEAP_TOKEN=yourTokenHere"`  
`Add-Content -Path .env -Value "GOOGLEMAPS_API_KEY=yourTokenHere"`  
Mac:  
`echo "DWAVELEAP_TOKEN=yourTokenHere" > .env && echo "GOOGLEMAPS_API_KEY=yourTokenHere" >> .env`

## JS/React/Client Setup

### CD to client dir:

`cd ../client`

### Install JS dependencies:

`npm install`

### Create a .env file

_Replace yourTokenHere with your token, Google token must have Maps JavaScript API, Routes API & Geocoding API enabled_  
Windows (Powershell): `Set-Content -Path .env -Value "VITE_GOOGLEMAPS_API_KEY=yourTokenHere"`  
Mac: `echo "VITE_GOOGLEMAPS_API_KEY=yourTokenHere" > .env`

## Running Demo

### Start server (from server dir)

_Make sure that env is activated_  
`py manage.py runserver`

### Start client (from client dir)

`npm run dev`

### Within the application

1. Create an account
2. Login
3. Go to create routes
4. Add new deliveries (remove test deliveries if you want)
5. Select number of vehicles, select depot (currently disabled), click optimize
6. Select a result to view details
