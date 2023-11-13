
using CourseScheduling.Services.Contracts;
using System.Collections.Generic;
using System.Linq;
using System;
using CourseScheduling.Models;

namespace CourseScheduling.Mediator.Handlers
{
    public class AllotRegistrationCommandHandler : ICommandHandler
    {
        private readonly IRegistrationService _registrationService;
        private const int commandBlockCount = 2;

        public AllotRegistrationCommandHandler(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }


        public IEnumerable<string> Handle(string command)
        {
            try
            {
                var isInputValid = ValidateAllotRegistration(command, out string courseOfferingId);
                if (!isInputValid)
                    return new string[] { "INPUT_DATA_ERROR" };
                var result = _registrationService.AllotRegistration(courseOfferingId, out CourseOffering courseOffering);
                return BuildAllotRegistrationResponse(result, courseOffering);
            }
            catch (Exception ex)
            {
                return new string[] { ex.Message };
            }
        }

        private IEnumerable<string> BuildAllotRegistrationResponse(IEnumerable<Registration> registrations, CourseOffering courseOffering) =>
             registrations.Select(r => $"{r.Id} {r.EmployeeEmail} {r.CourseOfferingId} {courseOffering.Title} {courseOffering.Instructor} {courseOffering.Date.ToString("ddMMyyyy")} {r.Status.ToString()}");


        private bool ValidateAllotRegistration(string inputCommand, out string courseOfferingId)
        {
            courseOfferingId = null;
            var commandArray = inputCommand.Split(' ').Select(text => text.Trim()).ToList();
            if (commandArray.Count != commandBlockCount)
                return false;

            if (string.IsNullOrEmpty(commandArray[1])) return false;
            courseOfferingId = commandArray[1];
            return true;
        }


    }
}