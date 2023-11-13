using CourseScheduling.Models;
using System.Collections.Generic;

namespace CourseScheduling.Services.Contracts
{
    public interface ICourseOfferingService
    {
        List<CourseOffering> GetCourseOfferings();
        CourseOffering GetCourseOffering(string CourseOfferingId);
        CourseOffering AddCourseOffering(CourseOffering courseOffering);
    }
}