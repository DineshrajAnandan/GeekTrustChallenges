using System;
using CourseScheduling.Mediator;
using System.IO;
namespace GeekTrust
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                string[] inputData = File.ReadAllLines(args[0]);
                var commandMediator = new CommandMediator();
                foreach(var command in inputData) {
                    var output = commandMediator.ExecuteCommand(command);
                    foreach(var item in output) 
                        Console.WriteLine(item);
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.ReadLine();
            }          

        }
    }
}
