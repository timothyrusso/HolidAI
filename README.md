<div align="center">
        <img src="ui/assets/images/readme_icon.png" width="94" height="94" alt="HolidAI Icon" style="border-radius: 50%;">
    <h1>
            HolidAI
    </h1>
</div>

A smart travel planning assistant that leverages Google Gemini AI to create personalized trip itineraries. Simply input your destination, travel dates, budget, and number of travelers to receive customized travel plans tailored specifically to your needs - eliminating hours of research and planning.

## Screenshots

<table>
   <tr>
      <td><strong>Home Page</strong><br><img src="wiki/images/home_page.png" alt="Home Page"></td>
      <td><strong>Detail Page</strong><br><img src="wiki/images/trip_detail_page.png" alt="Trip Detail Page"></td>
   </tr>
</table>

## Setup Instructions

To run this project, you'll need to:

1. Add the following configuration files to the root project directory:

   - `google-services.json` (for Android)
   - `GoogleService-Info.plist` (for iOS)

2. Create environment variables as specified in the `.env.sample` file.

These files contain necessary configuration for Google services integration and environment-specific settings.

## Get started with the development build

1. Install dependencies

   ```bash
   npm install
   ```

2. Build the app

   ```bash
    npm run ios && npm run android
   ```

3. Run the app

   ```bash
    npm run start
   ```
