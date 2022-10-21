<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="rptViewer.aspx.cs" Inherits="WebAppSISGEFIN.rptViewer" %>

<%@ Register assembly="CrystalDecisions.Web, Version=13.0.4000.0, Culture=neutral, PublicKeyToken=692fbea5521e1304" namespace="CrystalDecisions.Web" tagprefix="CR" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
<form id="form1" runat="server">

    <CR:CrystalReportViewer ID="CrystalReportViewer1" runat="server" ReuseParameterValuesOnRefresh="True" ToolPanelView="None" DisplayStatusbar="False" EnableDatabaseLogonPrompt="False" EnableTheming="False" HasCrystalLogo="False" HasToggleParameterPanelButton="False" Width="100%" EnableParameterPrompt="False" BestFitPage="False" GroupTreeStyle-BorderStyle="None" GroupTreeStyle-ShowLines="False" HasDrillUpButton="False" HasPageNavigationButtons="False" Height="100%" />

</form>
</body>
</html>








