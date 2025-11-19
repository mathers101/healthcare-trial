// import { createTransport } from "nodemailer";
// import { constants } from "../../lib/global-constants";

// export async function sendVerificationRequest(params: {
//   identifier: string;
//   url: string;
//   expires: Date;
//   provider: NodemailerConfig;
//   token: string;
//   theme: Theme;
//   request: Request;
// }) {
//   const { token, identifier, url, provider, theme } = params;
//   const { host } = new URL(url);

//   const transport = createTransport(provider.server);

//   const escapedHost = host.replace(/\./g, "&#8203;.");
//   const pathThing = escapedHost === "localhost:3000"
//     ? "public"
//     : constants.SITE_URL;
//   const result = await transport.sendMail({
//     to: identifier,
//     from: provider.from,
//     subject: `Your Citeful verification code`,
//     text: text({ url, host, token }),
//     html: html({ url, host, theme, token }),
//     attachments: [{
//       filename: "logo.png",
//       path: pathThing + "/logo.png",
//       cid: "logo",
//     }],
//   });
//   const failed = result.rejected.filter(Boolean);
//   if (failed.length) {
//     throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
//   }
// }

// /**
//  * Email HTML body
//  * Insert invisible space into domains from being turned into a hyperlink by email
//  * clients like Outlook and Apple mail, as this is confusing because it seems
//  * like they are supposed to click on it to sign in.
//  *
//  * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
//  */

// function html(
//   params: { url: string; host: string; theme: Theme; token: string },
// ) {
//   const { host, theme, token } = params;

//   const escapedHost = host.replace(/\./g, "&#8203;.");

//   const brandColor = theme.brandColor || "#346df1";
//   const color = {
//     background: "rgb(239, 239, 239)",
//     text: "#444",
//     mainBackground: "#fff",
//     buttonBackground: brandColor,
//     buttonBorder: brandColor,
//     buttonText: theme.buttonText || "#fff",
//   };

//   const logo = `
//         <div align="center" style="padding: 1rem 0rem 0rem">
//             <img src="cid:logo" width="150" />
//         </div>
//         `;

//   return `
// <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
//   <table role="presentation"
//     style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: ${color.background};">
//     <tbody>
//       <tr>
//         <td align="center" style="padding: 0rem 0rem 1rem; vertical-align: top; width: 100%;">
//           <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
//             <tbody>
//               <tr>
//                 <td style="padding: 20px 0px 0px;">
//                   <div style="padding: 20px; background-color: ${color.mainBackground}; border-radius: 8px;">
//                     <a href="https://${escapedHost}">
//                       ${logo}
//                     </a>
//                     <div style="color: rgb(0, 0, 0); text-align: center;">
//                       <h1 style="margin: 2rem 0">Sign in to Citeful</h1>
//                     </div>
//                     <div>
//                       <p style="padding-bottom: 16px">Here is your verification code to sign in to your Citeful account.<br> <br>
//                         This code will expire in five minutes and can only be used once.</p>
//                       <p align="center" style="padding-bottom: 16px; font-size: 36px"><strong>${token}</strong></p>
//                       <p style="padding-bottom: 16px">If you did not attempt to sign in using this address, please ignore this email.</p>
//                       <p style="padding-bottom: 16px">Thanks,<br>The Citeful team</p>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </body>
// `;
// }

// /** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
// function text(
//   { token }: { url: string; host: string; token: string },
// ) {
//   return `Your Citeful verification code: ${token}`;
// }
