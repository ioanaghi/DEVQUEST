FROM eclipse-temurin:21-jdk-alpine
RUN addgroup -g 65534 runner 2>/dev/null || true
WORKDIR /tmp
USER 65534:65534
ENV JAVA_TOOL_OPTIONS="-Xms16m -Xmx96m -XX:ActiveProcessorCount=1 -XX:+UseSerialGC -XX:-UsePerfData"
CMD ["sh", "-c", "javac -d /tmp /source/Registration.java /source/Harness.java && java -cp /tmp Harness"]
