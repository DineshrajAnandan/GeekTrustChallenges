using CourseScheduling.Models;
using System.Collections.Generic;

namespace CourseScheduling.Services.Contracts
{
    public interface IRegistrationService
    {
        Registration AddRegistration(Registration courseOffering);
        string CancelRegistration(string registrationId);
        IEnumerable<Registration> AllotRegistration(string CourseOfferingId, out CourseOffering courseOffering);
    }
}