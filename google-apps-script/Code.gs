/**
 * Gaytri Engineering Works — quotation / inquiry mail handler.
 *
 * Deploy this file as a Google Apps Script Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * The deployed /exec URL is placed in public/js/config.js as
 * GEW_CONFIG.quotationEndpoint.
 */

const GEW = {
  recipients: [
    'sanjaydudey94510@gmail.com',
    'seskd@yahoo.com'
  ],
  companyName: 'GAYTRI ENGINEERING WORKS',
  phone: '+91 98768-58739 | +91 94510-55994',
  email: 'sanjaydudey94510@gmail.com | seskd@yahoo.com',
  address: 'H.No. 85-B, Mohan Avenue, Near Spring Dale School, F.G.C. Road, Amritsar – 143001, Punjab, India'
};

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'gaytri-engineering-works-inquiry'
  });
}

function doPost(e) {
  try {
    const data = parseRequest_(e);

    // Honeypot: legitimate visitors never fill this hidden field.
    if (String(data.website_check || '').trim() !== '') {
      return jsonResponse({
        ok: true,
        message: 'Thank you. Your inquiry has been received.'
      });
    }

    const request = normalizeRequest_(data);
    validateRequest_(request);

    sendInquiry_(request);
    sendClientAcknowledgement_(request);

    return jsonResponse({
      ok: true,
      message: 'Thank you. Your inquiry has been sent to Gaytri Engineering Works.'
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({
      ok: false,
      message: 'We could not send the inquiry right now. Please call GEW directly.'
    });
  }
}

function parseRequest_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Empty request body.');
  }

  const raw = e.postData.contents;
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid request payload.');
  }

  return parsed;
}

function normalizeRequest_(data) {
  return {
    name: clean_(data.name, 100),
    company: clean_(data.company, 150),
    email: clean_(data.email, 180),
    phone: clean_(data.phone, 25),
    workType: clean_(data.workType, 120),
    location: clean_(data.location, 120),
    manpower: clean_(data.manpower, 80),
    message: clean_(data.message, 2500),
    website: clean_(data.website, 180),
    websiteCheck: clean_(data.website_check, 100)
  };
}

function validateRequest_(request) {
  if (!request.name) throw new Error('Name is required.');
  if (!request.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
    throw new Error('A valid email is required.');
  }
  if (!request.phone) throw new Error('Phone is required.');
  if (!request.workType) throw new Error('Work type is required.');
  if (!request.message) throw new Error('Work details are required.');
}

function sendInquiry_(request) {
  const subject = 'GEW Website Inquiry — ' + request.workType + ' — ' + request.name;

  const body = [
    'NEW QUOTATION / WORK INQUIRY',
    '',
    'Name: ' + request.name,
    'Company / Plant: ' + valueOrNotProvided_(request.company),
    'Email: ' + request.email,
    'Phone / WhatsApp: ' + request.phone,
    'Work Required: ' + request.workType,
    'Site / Plant Location: ' + valueOrNotProvided_(request.location),
    'Approx. Manpower Required: ' + valueOrNotProvided_(request.manpower),
    'Company Website: ' + valueOrNotProvided_(request.website),
    '',
    'PROJECT DETAILS / SCOPE',
    request.message,
    '',
    'Submitted through the Gaytri Engineering Works website.',
    '',
    GEW.companyName,
    GEW.address,
    GEW.phone,
    GEW.email
  ].join('\n');

  MailApp.sendEmail({
    to: GEW.recipients.join(','),
    replyTo: request.email,
    name: GEW.companyName,
    subject: subject,
    body: body
  });
}

function sendClientAcknowledgement_(request) {
  const subject = 'Gaytri Engineering Works — Inquiry Received';

  const body = [
    'Dear ' + request.name + ',',
    '',
    'Thank you for contacting Gaytri Engineering Works (GEW).',
    '',
    'We have received your inquiry regarding: ' + request.workType + '.',
    'Our team will review your requirement and contact you on ' + request.phone + '.',
    '',
    'Regards,',
    GEW.companyName,
    'Amritsar, Punjab',
    GEW.phone,
    GEW.email
  ].join('\n');

  MailApp.sendEmail({
    to: request.email,
    name: GEW.companyName,
    subject: subject,
    body: body
  });
}

function clean_(value, maxLength) {
  const text = value == null ? '' : String(value).trim();
  return text.substring(0, maxLength);
}

function valueOrNotProvided_(value) {
  return value ? value : 'Not provided';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
