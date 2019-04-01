package util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class AttachmentUtil {

    public static String cleanContentId(String id) {
        if (id != null) {
            if (id.startsWith("<")) {
                id = id.substring(1, id.length() - 1);
            }

            if (id.startsWith("cid:")) {
                id = id.substring(4);
            }

            try {
                id = URLDecoder.decode(id, StandardCharsets.UTF_8.name());
            } catch (UnsupportedEncodingException var2) {
            }
        }

        if (id == null) {
            id = "root.message@cxf.apache.org";
        }

        return id;
    }

}
