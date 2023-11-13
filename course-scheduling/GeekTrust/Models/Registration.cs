using CourseScheduling.Models.Enums;

namespace CourseScheduling.Models
{
    public class Registration
    {
        public string Id { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeEmail { get; set; }
        public string CourseOfferingId { get; set; }
        public RegistrationStatus Status { get; set; }
    }
}