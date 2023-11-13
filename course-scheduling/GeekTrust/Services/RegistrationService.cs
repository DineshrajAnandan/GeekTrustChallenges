using CourseScheduling.Models;
using CourseScheduling.Models.Enums;
using System.Collections.Generic;
using CourseScheduling.Services.Contracts;
using System.Linq;
using System;

namespace CourseScheduling.Services
{
    public class RegistrationService : IRegistrationService
    {
        private List<Registration> _data;
        private readonly ICourseOfferingService _courseOfferingService;

        public RegistrationService(ICourseOfferingService courseOfferingService)
        {
            _data = new List<Registration>();
            _courseOfferingService = courseOfferingService;
        }

        public Registration AddRegistration(Registration registration)
        {
            var courseoffering = GetCourseOfferingForRegistration(registration);
            if (courseoffering == null || CheckRegistrationAlreadyExists(registration))
                throw new Exception("INPUT_DATA_ERROR");

            var totalRegistration = GetTotalRegistraionCountForCourseOffering(registration.CourseOfferingId);
            if (totalRegistration >= courseoffering.MaxEmployees)
                throw new Exception("COURSE_FULL_ERROR");

            registration.Id = ComputeRegistrationId(registration, courseoffering.Title);
            registration.Status = RegistrationStatus.ACCEPTED;

            _data.Add(registration);
            return registration;
        }

        public string CancelRegistration(string registrationId)
        {
            var registration = _data.Find(d => d.Id.Equals(registrationId, StringComparison.OrdinalIgnoreCase));
            if (registration == null)
                throw new Exception("INPUT_DATA_ERROR");
            if (registration.Status == RegistrationStatus.CONFIRMED)
                return "CANCEL_REJECTED";

            registration.Status = RegistrationStatus.CANCELLED;
            return "CANCEL_ACCEPTED";
        }

        public IEnumerable<Registration> AllotRegistration(string CourseOfferingId, out CourseOffering courseOffering)
        {
            courseOffering = _courseOfferingService.GetCourseOffering(CourseOfferingId);
            if (courseOffering == null || courseOffering.Date.Date < DateTime.Now.Date)
                throw new Exception("INPUT_DATA_ERROR");

            var registrations = GetRegistrationsByCourseOfferingId(CourseOfferingId);
            RegistrationStatus updateStatus =
                 (registrations.Count < courseOffering.MinEmployees) ? RegistrationStatus.COURSE_CANCELED : RegistrationStatus.CONFIRMED;

            foreach (var item in registrations)
                item.Status = updateStatus;

            return registrations;
        }

        private List<Registration> GetRegistrationsByCourseOfferingId(string courseOfferingId) =>
            _data.FindAll(d =>
                    d.CourseOfferingId.Equals(courseOfferingId, StringComparison.OrdinalIgnoreCase) &&
                    d.Status != RegistrationStatus.CANCELLED)
                .OrderBy(x => x.EmployeeEmail).ToList();


        private bool CheckRegistrationAlreadyExists(Registration registration) =>
            _data.Find(d =>
                d.Status != RegistrationStatus.CANCELLED &&
                d.CourseOfferingId.Equals(registration.CourseOfferingId, StringComparison.OrdinalIgnoreCase) &&
                d.EmployeeEmail.Equals(registration.EmployeeEmail, StringComparison.OrdinalIgnoreCase)) != null;

        private int GetTotalRegistraionCountForCourseOffering(string CourseOfferingId) =>
            _data.Count(d => d.CourseOfferingId.Equals(CourseOfferingId, StringComparison.OrdinalIgnoreCase));


        private CourseOffering GetCourseOfferingForRegistration(Registration registration) =>
            _courseOfferingService.GetCourseOfferings()
                .Find(co => co.Id.Equals(registration.CourseOfferingId, StringComparison.OrdinalIgnoreCase));


        private string ComputeRegistrationId(Registration registration, string courseName) =>
            $"REG-COURSE-{registration.EmployeeName}-{courseName}";

    }
}