//package com.example.dpimock;//package com.example.dpimock;
////
////import org.springframework.context.annotation.Configuration;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
////import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
////
////@Configuration
////@EnableWebSecurity
////public class SecurityConfig extends WebSecurityConfigurerAdapter {
////
////    @Override
////    protected void configure(HttpSecurity security) throws Exception
////    {
////        security.httpBasic().disable();
////    }
////}
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.env.Environment;
//
//import javax.annotation.PostConstruct;
//
//@Configuration
//public class SecurityConfig {
//    @Autowired
//    private Environment env;
//
//    @PostConstruct
//    private void configureSSL() {
//        //set to TLSv1.1 or TLSv1.2
//        System.setProperty("https.protocols", "TLSv1.1");
//
//        //load the 'javax.net.ssl.trustStore' and
//        //'javax.net.ssl.trustStorePassword' from application.properties
//        System.setProperty("javax.net.ssl.trustStore", env.getProperty("server.ssl.trust-store"));
//        System.setProperty("javax.net.ssl.trustStorePassword",env.getProperty("server.ssl.trust-store-password"));
//    }
//}