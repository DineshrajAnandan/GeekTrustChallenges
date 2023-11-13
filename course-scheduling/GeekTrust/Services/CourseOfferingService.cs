using CourseScheduling.Models;
using System.Collections.Generic;
using CourseScheduling.Services.Contracts;
using System;

namespace CourseScheduling.Services
{
    public class CourseOfferingService : ICourseOfferingService
    {
        private List<CourseOffering> _data;
        public CourseOfferingService()
        {
            _data = new List<CourseOffering>();
        }

        public List<CourseOffering> GetCourseOfferings() => _data;

        public CourseOffering GetCourseOffering(string CourseOfferingId) =>
            _data.Find(d => d.Id.Equals(CourseOfferingId, StringComparison.OrdinalIgnoreCase));

        public CourseOffering AddCourseOffering(CourseOffering courseOffering)
        {
            if (!ValidateNewCourseOffering(courseOffering))
                throw new Exception("INPUT_DATA_ERROR");
            courseOffering.Id = ComputeCourseOfferingId(courseOffering);
            _data.Add(courseOffering);
            return courseOffering;
        }

        private string ComputeCourseOfferingId(CourseOffering courseOffering) =>
            $"OFFERING-{courseOffering.Title}-{courseOffering.Instructor}";

        private bool ValidateNewCourseOffering(CourseOffering courseOffering) =>
         !string.IsNullOrEmpty(courseOffering.Instructor) &&
                    !string.IsNullOrEmpty(courseOffering.Title) &&
                    courseOffering.Date != null &&
                    courseOffering.MinEmployees > 0 &&
                    courseOffering.MaxEmployees > 0;

    }
}