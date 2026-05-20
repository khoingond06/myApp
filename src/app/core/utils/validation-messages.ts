export const VALIDATION_MESSAGES: { [key: string]: string | ((args: any) => string) } = {
  required: 'Trường này không được để trống',
  email: 'Email không đúng định dạng',
  minlength: (args: { requiredLength: number }) => `Độ dài tối thiểu là ${args.requiredLength} ký tự`,
  maxlength: (args: { requiredLength: number }) => `Độ dài tối đa là ${args.requiredLength} ký tự`,
  min: (args: { min: number }) => `Giá trị phải lớn hơn hoặc bằng ${args.min}`,
  max: (args: { max: number }) => `Giá trị phải nhỏ hơn hoặc bằng ${args.max}`,
  pattern: 'Dữ liệu không hợp lệ',
  passwordMismatch: 'Mật khẩu xác nhận không khớp',
  whiteSpace: 'Không được chứa toàn khoảng trắng'
};
