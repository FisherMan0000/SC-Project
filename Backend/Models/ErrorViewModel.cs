namespace Backend.Models // ตรวจสอบให้ Namespace ตรงกับโปรเจคของคุณ
{
    public class ErrorViewModel
    {
        public string RequestId { get; set; }
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}
