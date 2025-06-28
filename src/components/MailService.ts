import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_jb7xhwc';
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'dMklxQ2oAXkG4fuoL'; // EmailJS public key

// Email template IDs
export const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_m8lqsn7';
export const SUBSCRIPTION_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_SUBSCRIPTION_TEMPLATE_ID || 'template_on9uila';

export const sendEmail = async (
  formData: { [key: string]: string },
  templateId: string = CONTACT_TEMPLATE_ID
) => {
  console.log('Using template ID:', templateId); // Debug log
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      formData,
      { publicKey: USER_ID }
    );
    console.log('Email sent successfully:', {
      status: response.status,
      text: response.text,
      params: formData
    });
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null) {
      console.error('Email sending failed:', {
        message: (error as { message?: string }).message,
        status: (error as { status?: string }).status,
        response: (error as { response?: string }).response,
        params: formData,
        stack: (error as { stack?: string }).stack // Added for more debugging info
      });
    } else {
      console.error('Email sending failed:', { error, params: formData });
    }
    return { success: false, error };
  }
};