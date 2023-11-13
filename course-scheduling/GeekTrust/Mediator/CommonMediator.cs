
using CourseScheduling.Services.Contracts;
using CourseScheduling.Services;
using System.Collections.Generic;
using System.Linq;
using CourseScheduling.Constants;
using CourseScheduling.Mediator.Handlers;
using System;


namespace CourseScheduling.Mediator
{
    public class CommandMediator
    {
        private readonly ICourseOfferingService _courseOfferingService;
        private readonly IRegistrationService _registrationService;
        public CommandMediator()
        {
            _courseOfferingService = new CourseOfferingService();
            _registrationService = new RegistrationService(_courseOfferingService);
        }

        public IEnumerable<string> ExecuteCommand(string inputCommand)
        {
            try
            {
                var command = inputCommand?.Split(' ').FirstOrDefault();
                return GetHandler(command).Handle(inputCommand);
            }
            catch (Exception ex)
            {
                return new string[] { ex.Message };
            }
        }

        private ICommandHandler GetHandler(string command) => command switch
            {
                CliCommand.ADD_COURSE_OFFERING => new CourseOfferingCommandHandler(_courseOfferingService),
                CliCommand.REGISTER => new AddRegistrationCommandHandler(_registrationService),
                CliCommand.CANCEL => new CancelRegistrationCommandHandler(_registrationService),
                CliCommand.ALLOT => new AllotRegistrationCommandHandler(_registrationService),
                _ => throw new Exception("NOT_A_VALID_COMMAND")
            };

    }
}