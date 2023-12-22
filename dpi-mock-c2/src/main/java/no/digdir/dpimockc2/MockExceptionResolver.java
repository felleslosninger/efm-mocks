package no.digdir.dpimockc2;


import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MockExceptionResolver extends DefaultErrorAttributes {

//    @Override
//    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, @Nullable Object handler, Exception ex) {
//        try {
//            if (ex instanceof AuthenticationException) {
//                return this.handleAuthenticationException((AuthenticationException) ex, request, response, handler);
//            }
//        } catch (Exception var6) {
//            if (this.logger.isWarnEnabled()) {
//                this.logger.warn("Failure while trying to resolve exception [" + ex.getClass().getName() + "]", var6);
//            }
//        }
//
//        return super.doResolveException(request, response, handler, ex);
//    }
//
//    private ModelAndView handleAuthenticationException(AuthenticationException ex, HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
//        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
//        return new ModelAndView();
//    }
}
