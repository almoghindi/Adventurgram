# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /source

# Copy everything
COPY . .
RUN dotnet dev-certs https --trust
# Restore as distinct layers
RUN dotnet restore "./user-profile/UserProfiles.csproj" --disable-parallel
# Build and publish a release
RUN dotnet publish "./user-profile/UserProfiles.csproj" -c release -o /app --no-restore

# Serve stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app ./

# List the contents of /app to verify the DLL name

EXPOSE 3000
ENTRYPOINT [ "dotnet", "UserProfiles.dll" ]