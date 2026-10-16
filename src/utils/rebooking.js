export function rebookingDraft(template, services, user) {
  if (!user?.id || template?.ownerId !== user.id || !Number.isSafeInteger(template.sourceId) || template.sourceId <= 0) return null;
  const key = typeof template.serviceKey === 'string' && Object.hasOwn(services, template.serviceKey) ? template.serviceKey : null;
  const service = key ? services[key] : null;
  const originalHours = Number.isInteger(template.durationHours) ? template.durationHours : service?.minHours ?? 2;
  const duration = service ? Math.min(service.maxHours, Math.max(service.minHours, originalHours)) : 2;
  return {
    sourceId: template.sourceId, selectedKey: key, duration,
    unavailable: !service, durationChanged: Boolean(service && duration !== originalHours),
    customerInfo: {
      name: template.contactName || user.fullName || '', phone: template.contactPhone || user.phoneNumber || '',
      email: user.email || '', address: template.address || user.address || '', notes: template.notes || '', paymentMethod: 'cash',
    },
  };
}

export function rebookingNotice(draft) {
  if (!draft) return '';
  return `Đặt lại từ CM${draft.sourceId}. Chọn lịch mới và kiểm tra thông tin; giá áp dụng theo dịch vụ hiện tại. Cleaner sẽ nhận ca mới theo tình trạng còn trống.${draft.unavailable ? ' Dịch vụ cũ không còn mở đặt. Vui lòng chọn dịch vụ khác.' : ''}${draft.durationChanged ? ' Thời lượng đã điều chỉnh theo giới hạn hiện tại; vui lòng kiểm tra lại.' : ''}`;
}
