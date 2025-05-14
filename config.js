const testServer = true;


const common_config = {
    
}


const production_config = {
    ...common_config,
   api:{
        // baseURL: 'http://localhost:3001',
        baseURL: 'https://znw53cdw-3001.inc1.devtunnels.ms',
    }
}

const test_config = {
    ...common_config,
    api:{
        // baseURL: 'http://localhost:3001',
        baseURL: 'https://znw53cdw-3001.inc1.devtunnels.ms',
    }
}






const config = testServer ? test_config : production_config;
module.exports = config;