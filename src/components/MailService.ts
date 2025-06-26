import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_jb7xhwc';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_m8lqsn7';
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'dMklxQ2oAXkG4fuoL'; // EmailJS public key

export const sendEmail = async (formData: { name: string; email: string; subject: string; message: string }) => {
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      { publicKey: USER_ID }
    );
    console.log('Email sent successfully:', {
      status: response.status,
      text: response.text,
      params: templateParams
    });
    return { success: true };
  } catch (error: any) {
    console.error('Email sending failed:', {
      message: error.message,
      status: error.status,
      response: error.response,
      params: templateParams,
      stack: error.stack // Added for more debugging info
    });
    return { success: false, error };
  }
};