package no.digdir.dpimockc2;

import net.minidev.json.JSONObject;
import no.difi.meldingsutveksling.domain.sbdh.PartnerIdentification;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@Component
public class PrincipalService {

    public PartnerIdentification getDatabehandler(Principal principal) {
        JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
        Map<String, Object> tokenAttributes = token.getTokenAttributes();

        JSONObject object = (JSONObject) Optional.ofNullable(tokenAttributes.get("supplier"))
                .orElseGet(() -> tokenAttributes.get("consumer"));

        return new PartnerIdentification()
                .setAuthority(object.getAsString("authority"))
                .setValue(object.getAsString("ID"));
    }
}
