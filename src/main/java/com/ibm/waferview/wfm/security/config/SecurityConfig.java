package com.ibm.waferview.wfm.security.config;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ibm.waferview.wfm.security.handler.WfmAccessDeniedHandler;
import com.ibm.waferview.wfm.security.handler.WfmAuthenticationEntryPoint;
import com.ibm.waferview.wfm.security.handler.WfmAuthenticationFailureHandler;
import com.ibm.waferview.wfm.security.handler.WfmAuthenticationSuccessHandler;
import com.ibm.waferview.wfm.security.jwt.WfmAuthenticationTokenFilter;
import com.ibm.waferview.wfm.security.service.impl.WfmAuthUserDetailsServiceImpl;

import lombok.extern.slf4j.Slf4j;



/**
 * 
 * 
 *
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Slf4j
//@PropertySource(value = {"classpath:application.properties"})
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private WfmAuthenticationTokenFilter jwtAuthenticationTokenFilter;
    @Autowired
    private WfmAuthUserDetailsServiceImpl userDetailsService;
    @Value("${jwt.expiration}")
    private int tokenExpiration;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userDetailsService).passwordEncoder(passwordEncoder());
    }

    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public WfmAuthenticationSuccessHandler goAuthenticationSuccessHandler(){
        return new WfmAuthenticationSuccessHandler();
    }

    @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	log.info("-----------------security ------------");
        http.headers().frameOptions().disable();
        http.csrf().disable()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) 
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) 
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS) 
                .and()
                .authorizeRequests()
               .antMatchers("/service/auth/**").permitAll()
               .antMatchers("/service/api/listEqpStatusInfo").permitAll()
               .antMatchers("/service/api/wfm_monitor").permitAll()
               .antMatchers("/service/api/wfm_monitor3d").permitAll()
               .antMatchers("/service/api/listWips").permitAll()
               .antMatchers("/service/api/getColorMap").permitAll()
               .antMatchers("/service/api/getEqpStatusMaps").permitAll()
               .antMatchers("/service/api/listEqpStatusChangeHis").permitAll()
               .antMatchers("/service/api/menus").permitAll()
               .antMatchers("/service/api/getOHTStatus").permitAll()
               .antMatchers("/service/api/getEqpModelDefs").permitAll()
               .antMatchers("/**/*.glb",
            		   "/**/*.gltf",
            		   "/**/*.bin").permitAll()
               .antMatchers("/**/*.js",
            		   "/**/*.css",
            		   "/**/*.min.css",
            		   "/**/*.jpg",
            		   "/**/*.png",
            		   "/**/*.gif",
            		   "/**/*.html",
            		   "/**/*.css.map",
            		   "/**/*.eot",
            		   "/**/*.svg",
            		   "/**/*.ttf",
            		   "/**/*.woff",
            		   "/**/*.woff2",
            		   "/**/*.less"
            		   ).permitAll()
//                .anyRequest().authenticated()
                .and()
                .formLogin()//.loginPage("/forward.jsp")
                //.successHandler(goAuthenticationSuccessHandler())
                .failureHandler(new WfmAuthenticationFailureHandler())
                .permitAll();
                //.and()
                //.logout()
                //.logoutSuccessHandler(new AmsLogoutSuccessHandler())
                //.permitAll();
        
        http.rememberMe().rememberMeParameter("remember-me")
                .userDetailsService(userDetailsService).tokenValiditySeconds(tokenExpiration * 60 );


        http.exceptionHandling().authenticationEntryPoint(new WfmAuthenticationEntryPoint())
                .accessDeniedHandler(new WfmAccessDeniedHandler())
                //.and().formLogin().loginProcessingUrl("/wfm-component-client/service/auth/login")
                .and().addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }


}
