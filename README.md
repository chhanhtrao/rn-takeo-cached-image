# rn-takeo-cached-image

A package that make remote resource request and map resource to Model object.

# Setup
  ### 1. Installation

  `npm install rn-takeo-cached-image` or `yarn add rn-takeo-cached-image`

  ### 2. Install Dependencies
  `npm install react-native-fs` or `yarn add react-native-fs`
  `npm install react-native-sqlite-storage` or `yarn add react-native-sqlite-storage`

  ### 3. IOS
  `cd ios; pod install`

  ### 4. Android
  Auto linked

# Usage
  ```javascript
  import CachedImage from 'rn-takeo-cached-image';
  ....
  
  <CachedImage
    source={{
      uri: 'image-uri',
    }}
    style={{width: 400, height: 400}}
  />
  ```

