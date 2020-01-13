A necessary evil
Stitch acts as a proxy for all outgoing requests. This has made APi endpoints behave abnormally, because of a an X-Forwarded-For header.
This acts as a general proxy that parses the request and forwards it to the desired andpoint