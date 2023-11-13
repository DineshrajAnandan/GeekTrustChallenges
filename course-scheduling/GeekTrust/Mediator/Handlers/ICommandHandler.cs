
using System.Collections.Generic;

namespace CourseScheduling.Mediator.Handlers
{
    public interface ICommandHandler 
    {
        IEnumerable<string> Handle(string command);
    }
}