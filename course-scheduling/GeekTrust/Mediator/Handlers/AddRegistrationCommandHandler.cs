
using CourseScheduling.Services.Contracts;
using CourseScheduling.Models;
using System.Collections.Generic;
using System.Linq;
using System;

namespace CourseScheduling.Mediator.Handlers
{
    public class AddRegistrationCommandHandler : ICommandHandler
    {
        private readonly IRegistrationService _registrationService;
        private const int commandBlockCount = 3;

        public AddRegistrationCommandHandler(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }


        public IEnumerable<string> Handle(string command)
        {
            try
            {
                var isInputValid = ValidateMakeRegistration(command, out Registration registration);
                if (!isInputValid)
                    return new string[] { "INPUT_DATA_ERROR" };
                var result = _registrationService.AddRegistration(registration);
                return new string[] { $"{result.Id} {result.Status.ToString()}" };
            }
            catch (Exception ex)
            {
                return new string[] { ex.Message };
            }
        }

        private bool ValidateMakeRegistration(string command, out Registration registration)
        {
            registration = null;
            var commandArray = command.Split(' ').Select(text => text.Trim()).ToList();
            if (commandArray.Count != commandBlockCount)
                return false;

            for (int i = 1; i < commandBlockCount; i++)
                if (string.IsNullOrEmpty(commandArray[i])) return false;

            registration = GetRegistrationFromCommand(commandArray);

            return true;
        }

        private Registration GetRegistrationFromCommand(List<string> commandArray) =>
           new Registration
           {
               EmployeeEmail = commandArray[1],
               EmployeeName = commandArray[1].Split('@')[0].Trim(),
               CourseOfferingId = commandArray[2]
           };

    }
}