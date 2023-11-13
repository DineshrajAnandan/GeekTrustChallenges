
# Pre-requisites
* CShap 2.2/3.1/5.0
* Dotnet

# How to run the code

We have provided scripts to execute the code. 

Use `run.sh` if you are Linux/Unix/macOS Operating systems and `run.bat` if you are on Windows.  Both the files run the commands silently and prints only output from the input file `sample_input/input1.txt`. You are supposed to add the input commands in the file from the appropriate problem statement. 

Internally both the scripts run the following commands 

 * `dotnet build -o geektrust` - This builds the solution and creates the `geektrust.dll` file inside the directory named `geektrust`
 * `dotnet geektrust/geektrust.dll sample_input/input1.txt` - This will execute the solution passing in the sample input file as the command line argument

 We expect your program to take the location to the text file as parameter. Input needs to be read from a text file, and output should be printed to the console. The text file will contain only commands in the format prescribed by the respective problem.

You should add an AssemblyName entry with the value geektrust in your .csproj file.

Given below is a sample

```
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <RootNamespace>geektrust_family_demo</RootNamespace>
    <!-- Add a assembly name entry to your project and make sure it is geektrust-->
    <AssemblyName>geektrust</AssemblyName>
  </PropertyGroup>
</Project>
 ```

 # Running the code for multiple test cases

 Please fill `input1.txt` and `input2.txt` with the input commands and use those files in `run.bat` or `run.sh`. Replace `dotnet geektrust/geektrust.dll sample_input/input1.txt` with `dotnet geektrust/geektrust.dll sample_input/input2.txt` to run the test case from the second file. 

 # How to execute the unit tests

 We expect you to create a separate project for Unit testing and assume that it will import the main project.

 We support xUnit and NUnit for unit testing and use Coverlet for checking the test coverage. Take a look at this page for more info on unit testing in C#

Given below is a sample `.csproj file` for `xUnit`

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="16.7.1" />
    <PackageReference Include="xunit" Version="2.4.1" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.4.3">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\SampleProject\SampleProject.csproj" />
  </ItemGroup>

</Project>
```
To execute the test cases we run the command

`dotnet test`

For calculating the coverage we run the command

`dotnet test --collect="XPlat Code Coverage"`

# Help

You can refer our help documents [here](https://help.geektrust.com)
You can read build instructions [here](https://github.com/geektrust/coding-problem-artefacts/tree/master/CSharp)