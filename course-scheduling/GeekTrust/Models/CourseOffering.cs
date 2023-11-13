using System;

namespace CourseScheduling.Models
{
    public class CourseOffering
    {
        public string Id { get; set; } // Ideally this should be int if we are using DB
        public string Title { get; set; }
        public string Instructor { get; set; }
        public DateTime Date { get; set; }
        public int MinEmployees { get; set; }
        public int MaxEmployees { get; set; }
    }
}