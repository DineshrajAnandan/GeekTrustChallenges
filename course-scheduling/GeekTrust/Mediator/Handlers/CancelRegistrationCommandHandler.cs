
using CourseScheduling.Services.Contracts;
using System.Collections.Generic;
using System.Linq;
using System;

namespace CourseScheduling.Mediator.Handlers
{
    public class CancelRegistrationCommandHandler : ICommandHandler
    {
        private readonly IRegistrationService _registrationService;
        private const int commandBlockCount = 2;

        public CancelRegistrationCommandHandler(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        public IEnumerable<string> Handle(string command)
        {
            try
            {
                var isInputValid = ValidateCancelRegistration(command, out string registrationId);
                if (!isInputValid)
                    return new string[] { "INPUT_DATA_ERROR" };
                var result = _registrationService.CancelRegistration(registrationId);
                return new string[] { $"{registrationId} {result}" };
            }
            catch (Exception ex)
            {
                return new string[] { ex.Message };
            }
        }
        
        private bool ValidateCancelRegistration(string command, out string registrationId)
        {
            registrationId = null;
            var commandArray = command.Split(' ').Select(text => text.Trim()).ToList();
            if (commandArray.Count != commandBlockCount)
                return false;

            if (string.IsNullOrEmpty(commandArray[1])) return false;
            registrationId = commandArray[1];
            return true;
        }

    }
}