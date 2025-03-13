# Workout App

This app is a simple workout tracker designed to help users improve their fitness and heath

## Software Needed

    - Visual Studio 2022
    - SQL Server Management Studio

## Recommended Version Control Tools

    - Git Extensions
    - Kdiff3

## Visual Studio Workloads

    - ASP.NET and WebDev
    - Node.js
    - .NET desktop
    - Data storage

## Easy Launch

    - Ensure that in visual studio the project is set to multiple project start

## Frontend Setup

1. Open up VSCode in WorkoutApp.client directory
2. run 'npm install'
3. run 'npm run dev'

## Backend setup

1. ensure .net tools are installed
2. open up terminal inside workoutapp.server
3. run 'dotnet run'

## Migrations

1. ensure entity framework tools are installed with 'dotnet tool install --global dotnet-ef'
2. to reflect updates, type 'dotnet ef migrations add (name of change in camelcase)'
3. then run 'dotnet ef database update'
4. database should now be updated according to the migrations in the migrations folder