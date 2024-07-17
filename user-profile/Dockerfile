# build stage

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app


# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore "./user-profile/UserProfiles.csproj" --disable-parallel
# Build and publish a release
RUN dotnet publish -c Release -o out --no-restore


# serve stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .


EXPOSE 3000
ENTRYPOINT [ "dotnet", "user-profile.dll" ]

