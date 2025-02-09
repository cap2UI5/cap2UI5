class z2ui5_cl_app_startup {

    async main(client) {

        this.BTN_TEXT = 'button text2';

        if (!this.CLASSNAME) {
            this.CLASSNAME = 'testclass';
        }

        client.view_xml = `<mvc:View displayBlock=\"true\" height=\"100%\" xmlns=\"sap.m\" xmlns:core=\"sap.ui.core\" xmlns:form=\"sap.ui.layout.form\" xmlns:mvc=\"sap.ui.core.mvc\" xmlns:table=\"sap.ui.table\" xmlns:unified=\"sap.ui.unified\"> 
        <Shell> 
            <Page showNavButton=\"false\" title=\"abap2UI5 - Developing UI5 Apps Purely in ABAP\"> 
                <headerContent> 
                    <ToolbarSpacer/> 
                    <Button icon=\"sap-icon://enablement\" press=\".eB([&apos;OPEN_DEBUG&apos;])\" text=\"Debugging Tools\"/> 
                    <Button icon=\"sap-icon://information\" press=\".eB([&apos;OPEN_INFO&apos;])\" text=\"System\"/>
                </headerContent> 
                <form:SimpleForm columnsL=\"1\" columnsM=\"1\" columnsXL=\"1\" editable=\"true\" emptySpanL=\"4\" emptySpanM=\"0\" emptySpanS=\"0\" emptySpanXL=\"0\" labelSpanL=\"3\" labelSpanM=\"4\" labelSpanS=\"12\" labelSpanXL=\"4\" layout=\"ResponsiveGridLayout\" singleContainerFullSize=\"false\"> 
                    <form:content> 
                        <Toolbar> 
                            <Title text=\"Quickstart\"/>
                        </Toolbar> 
                        <Label text=\"Step 1\"/> 
                        <Text text=\"Create a new class in your ABAP system\"/> 
                        <Label text=\"Step 2\"/> 
                        <Text text=\"Add the interface: Z2UI5_IF_APP\"/> 
                        <Label text=\"Step 3\"/> 
                        <Text text=\"Define the view, implement behaviour\"/> 
                        <Label/> 
                        <Link href=\"https://github.com/abap2UI5/abap2UI5/blob/main/src/01/03/z2ui5_cl_core_app_hello_w.clas.abap\" target=\"_blank\" text=\"(Example)\"/> 
                        <Label text=\"Step 4\"/> 
                        <Input placeholder=\"fill in the class name and press &apos;check&apos;\" showValueHelp=\"true\" submit=\".eB([&apos;BUTTON_CHECK&apos;])\" value=\"${client._bind_edit(this.CLASSNAME)}" valueHelpRequest=\".eB([&apos;VALUE_HELP&apos;])\" width=\"70%\"/> 
                        <Label/> 
                        <Button icon=\"{/MS_HOME/BTN_ICON}\" press=\".eB([&apos;BUTTON_CHECK&apos;])\" text=\"${client._bind(this.BTN_TEXT)}" width=\"70%\"/> 
                        <Label text=\"Step 5\"/> 
                        <Link enabled=\"{= \${/MS_HOME/CLASS_EDITABLE} === false }\" href=\"{/MS_HOME/URL}\" target=\"_blank\" text=\"Link to the Application\"/> 
                        <Toolbar> 
                            <Title text=\"What&apos;s next?\"/>
                        </Toolbar> 
                        <Label text=\"Start Developing\"/> 
                        <Button press=\".eF(&apos;OPEN_NEW_TAB&apos;, &apos;https://abap2ui5.github.io/web-abap2ui5-samples/?app_start=z2ui5_cl_demo_app_000&apos;)\" text=\"Explore Code Samples\" width=\"70%\"/> 
                        <Toolbar> 
                            <Title text=\"Contribution\"/>
                        </Toolbar> 
                        <Label text=\"Open an issue\"/> 
                        <Link href=\"https://github.com/abap2UI5/abap2UI5/issues\" target=\"_blank\" text=\"You have problems, comments or wishes?\"/> 
                        <Label text=\"Open a Pull Request\"/> 
                        <Link href=\"https://github.com/abap2UI5/abap2UI5/pulls\" target=\"_blank\" text=\"You added a new feature or fixed a bug?\"/> 
                        <Toolbar> 
                            <Title text=\"Social Media\"/>
                        </Toolbar> 
                        <Label/> 
                        <Link href=\"https://www.linkedin.com/company/abap2ui5\" target=\"_blank\" text=\"Follow abap2UI5 on Linkedin\"/> 
                        <Label/> 
                        <Link href=\"http://www.abap2UI5.org\" target=\"_blank\" text=\"www.abap2UI5.org\"/>
                    </form:content>
                </form:SimpleForm>
            </Page>
        </Shell>
    </mvc:View>`;

    }
}

module.exports = z2ui5_cl_app_startup;
