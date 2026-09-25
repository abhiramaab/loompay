package tech.abhiram.loompay.config;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tech.abhiram.loompay.service.RateLimiterService;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements org.springframework.web.
        servlet.HandlerInterceptor{

    private final RateLimiterService rateLimiterService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String merchantId = request.getHeader("X-Merchant-Id");
        if (merchantId == null || merchantId.isBlank()) {
            merchantId = "default_merchant";
        }

        boolean allowed = rateLimiterService.isAllowed(merchantId);

        if (!allowed){
            response.setStatus(429);
            response.setHeader("Retry-After", "10");
            response.setContentType("application/json");
            response.getWriter().write("""
                    {
                    "status": 429,
                    "error": "Too Many Requests",
                    "message": "Rate limit exceeded. You are allowed max 5 requests per 10 seconds."
                    }
                    """);
            return false;
        }
        return true;
    }
}
