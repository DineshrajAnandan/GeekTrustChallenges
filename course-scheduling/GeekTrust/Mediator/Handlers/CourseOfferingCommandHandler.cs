
using CourseScheduling.Services.Contracts;
using CourseScheduling.Models;
using System.Collections.Generic;
using System.Linq;
using System;

namespace CourseScheduling.Mediator.Handlers
{
    public class CourseOfferingCommandHandler : ICommandHandler
    {

        private readonly ICourseOfferingService _courseOfferingService;
        private const int commandBlockCount = 6;

        public CourseOfferingCommandHandler(ICourseOfferingService courseOfferingService)
        {
            _courseOfferingService = courseOfferingService;
        }

        public IEnumerable<string> Handle(string command)
        {
            try
            {
                var isInputValid = ValidateAddCourseOffering(command, out CourseOffering courseOffering);
                if (!isInputValid)
                    return new string[] { "INPUT_DATA_ERROR" };
                var result = _courseOfferingService.AddCourseOffering(courseOffering).Id;
                return new string[] { result };
            }
            catch (Exception)
            {
                return new string[] { "INPUT_DATA_ERROR" };
            }
        }

        private bool ValidateAddCourseOffering(string command, out CourseOffering courseOffering)
        {
            courseOffering = null;
            var commandArray = command.Split(' ').Select(text => text.Trim()).ToList();
            if (commandArray.Count != commandBlockCount)
                return false;

            for (int i = 1; i < commandBlockCount; i++)
                if (string.IsNullOrEmpty(commandArray[i])) return false;

            courseOffering = GetCourseOfferingFromCommand(commandArray);

            return true;
        }

        private CourseOffering GetCourseOfferingFromCommand(List<string> commandArray) =>
            new CourseOffering
            {
                Title = commandArray[1],
                Instructor = commandArray[2],
                Date = DateTime.ParseExact(commandArray[3], "ddMMyyyy",
                                    System.Globalization.CultureInfo.InvariantCulture,
                                    System.Globalization.DateTimeStyles.None),
                MinEmployees = int.Parse(commandArray[4]),
                MaxEmployees = int.Parse(commandArray[5]),

            };

    }
}