// Constants.js
const ROLE = {
    "Viewer":1,
    "Admin": 2
}

const RING = {
    "Assess":1,
    "Trial": 2,
    "Adopt":3,
    "Hold":4
}

const CATEGORY = {
    "Techniques":1,
    "Tools": 2,
    "Platforms":3,
    "Languages":4
}

const getEnumText = (id, list) => {
    const found = Object.entries(list).find(pair => pair[1] === id);
    return found[0];
}

const getEnumId = (text, list) => {
    const found = Object.entries(list).find(pair => pair[0] === text);
    return found[1];
}


const prod = {
    url: {
     API_URL: 'https://tactile-rigging-333212.oa.r.appspot.com'
    }
   };
   const dev = {
    url: {
     API_URL: 'http://localhost:3001'
    }
   };
   const config = process.env.NODE_ENV === 'development' ? dev : prod;
   export {config, RING,CATEGORY, ROLE, getEnumText,getEnumId}
   
