const { js2xml, xml2json } = require('xml-js');

const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<cartridge_basiclti_link xmlns="http://www.imsglobal.org/xsd/imslticc_v1p0"
    xmlns:blti = "http://www.imsglobal.org/xsd/imsbasiclti_v1p0"
    xmlns:lticm ="http://www.imsglobal.org/xsd/imslticm_v1p0"
    xmlns:lticp ="http://www.imsglobal.org/xsd/imslticp_v1p0"
    xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation = "http://www.imsglobal.org/xsd/imslticc_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd
    http://www.imsglobal.org/xsd/imsbasiclti_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0.xsd
    http://www.imsglobal.org/xsd/imslticm_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd
    http://www.imsglobal.org/xsd/imslticp_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd">
    <blti:title>Riff Chat</blti:title>
    <blti:description>Team video conference with social metrics</blti:description>
    <blti:icon></blti:icon>
    <blti:launch_url>https://staging.riffplatform.com/lti/launch</blti:launch_url>
    <blti:extensions platform="canvas.instructure.com">
      <lticm:property name="tool_id">put guid here</lticm:property>
      <lticm:property name="privacy_level">public</lticm:property>
      <lticm:options name="resource_selection">
        <lticm:property name="url">https://staging.riffplatform.com/lti/launch</lticm:property>
        <lticm:property name="text">Riff Chat</lticm:property>
        <lticm:property name="selection_width">400</lticm:property>
        <lticm:property name="selection_height">300</lticm:property>
        <lticm:property name="enabled">true</lticm:property>
      </lticm:options>
      <lticm:options name="course_navigation">
        <lticm:property name="url">https://staging.riffplatform.com/lti/launch</lticm:property>
        <lticm:property name="text">Riff Chat</lticm:property>
        <lticm:property name="visibility">public</lticm:property>
        <lticm:property name="default">enabled</lticm:property>
        <lticm:property name="enabled">true</lticm:property>
      </lticm:options>
    </blti:extensions>
    <cartridge_bundle identifierref="BLTI001_Bundle"/>
    <cartridge_icon identifierref="BLTI001_Icon"/>
</cartridge_basiclti_link>
`;

const json = xml2json(xml, { compact: true });

console.log(json);
