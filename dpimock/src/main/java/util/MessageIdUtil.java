package util;

import java.util.regex.Pattern;


public class MessageIdUtil {

    private static final String ATEXT = "[A-Za-z0-9!#\\$%&'\\*\\+\\-/=\\?\\^_`\\{}\\|~]+";

    private static final Pattern PATTERN =
            Pattern.compile("^" + ATEXT + "(\\." + ATEXT + ")*@" + ATEXT + "(\\." + ATEXT + ")*$");

    public static boolean verify(String identifier) {
        return PATTERN.matcher(identifier).matches();
    }

    public static String wrap(String cid) {
        if (cid == null) {
            return null;
        }

        if (cid.startsWith("<") && cid.endsWith(">")) {
            return cid;
        }

        return String.format("<%s>", cid);
    }
}



