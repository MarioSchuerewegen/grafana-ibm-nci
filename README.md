# IBM NCI plugin for Grafana

Author: Mario Schuerewegen

Contact: mario.schuerewegen@be.ibm.com

Revision: 0.1


**What's new:**

- 0.1
  - Initial Built   with support for Impact Objects and Array of Impact Objects DataTypes. 

Contents 
========

[**1. Introduction**](#introduction)

[**2  example Impact Policy and output parameters**](#PolicyExample)

[**3  How to create a new panel using the IBM NCI datasource **](#Panel)

[**4. Grafana installation**](#grafana-installation)

[**5. IBM NCI plugin installation**](#ibm-nci-plugin-installation)

[**6. IBM NCI data source configuration**](#ibm-NCI-data-source-configuration)

[**7. Troubleshooting**](#troubleshooting)

Introduction
============

Grafana is an open source metric analytics and visualization suite. It is most commonly used for visualizing time series data for infrastructure and application analytics, but many use it in other domains including industrial sensors, home automation, weather, and process control.

Features: [*https://grafana.com/grafana*](https://grafana.com/grafana)

Basic Concepts
[*http://docs.grafana.org/guides/basic\_concepts/*](http://docs.grafana.org/guides/basic_concepts/)

Live Demo: [*http://play.grafana.org/*](http://play.grafana.org/)

Documentation: [*http://docs.grafana.org/*](http://docs.grafana.org/)

Plugins: *<https://grafana.com/plugins>* (or search for Grafana on GitHub)


IBM NCI plugin adds Grafana support for:

- IBM Netcool Impact 7.x

The plugin uses the Impact DataUI provider's REST API to collect data directly from Impact
and show on the Grafana dashboard.

![](./media/Sample_LinuxOS_dashboard_animated.gif)

example Impact Policy and output parameters
===============================
An example Impact policy and param files is provided in the repository.
MultiRow.ipl and MultiRow.params
upload it to the Impact server via the upload policy .ipl and .param file wizard.


How to create a new panel using the IBM NCI datasource
===============================

Follow these steps to create a sample chart showing
disk IO metric for specific disk collected from two different servers.

![](./media/image4.png)

1.  Grafana logo -&gt; Dashboards -&gt; New.
2.  Drag and drop the Graph icon to the Empty Space.
![](./media/image5.png)
3.  Now it should look like below.
![](./media/image6.png)
4.  Click on the **Panel Title** bar and select **Edit**.
![](./media/image7.png)
5.  Click the **Data source** list and select the NCI data source. In this example it is named *NCIv8.1.3*.
![](./media/image8.png)
6.  Select **Agent Type** (you can type agent code or agent type name to
    search for supported agent type or scroll down a dropdown list).
    The list is built dynamically through the REST API call. If the resulting list is empty, a possible cause might be a connection problem with the NCI REST API. You can easily debug it with developer tools in Chrome or Firebug in Firefox (see the
    Troubleshooting chapter at the end of this document).
![](./media/image9.png)
7.  Select other parameters like Attribute Group, Attribute, Group by
    (only for Attribute groups with Primary Key/Display Item) and Agent
    Instance.
8.  Condition (for filtering results) and Alias (for parameter name
    customization) are optional. Alias, if defined will replace the default
    parameter name in the legend. The default is *AttributeName:DisplayItem*.
    The alias replaces *AttributeName*.
9.  The result should be similar to the one below.
![](./media/image10.png)
10.  In this example we want to draw data from two different agents on the
    same line chart. Click **+Add query**, to add a query from another agent
    and select the attribute the same way as above. The result should be similar
    to the one below.
![](./media/image11.png)
11.  Now let’s add the example filtering statement, and add agent name to the
    legend in the **Alias field**, so we can easily distinguish which line
    belongs to a particular agent. Add the **Condition** and **Alias** as shown in the example below.
![](./media/image12.png)

12.  We are almost done! Add a proper chart title in General tab.
![](./media/image13.png)
13.  Customize the legend in the Legend tab to make it look better and
    provide more useful information. Much more can be customized in the
    Display tab.
If you want to customize each data series separately, use the Display tab
and Series overrides section.
![](./media/image14.png)
14.  The chart is completed. You can resize it if you want to include more
    panels in the row, add new rows with the new panels and so on.
![](./media/image15.png)

Grafana installation
====================

Follow the steps described in the Grafana documentation:
[*http://docs.grafana.org/installation/*](http://docs.grafana.org/installation/) to install Grafana.



IBM NCI plugin installation
===========================
Latest verion of the plugin is always available on this GitHub page. It can be also installed from the Grafana plugin repository. If you upgrade from older plugin version, manually remove plugin directory, for example `/var/lib/grafana/plugins/grafana-ibm-NCI` or `/var/lib/grafana/plugins/ibm-NCI-datasource` and follow the installation steps below.

1).  Install the plugin using one of the following methods:

a.) Download the latest release of the IBM NCI plugin from [here](https://github.com/MarioSchuerewegen/grafana-ibm-nci/releases) and unpack on your Grafana server in `/var/lib/grafana/plugins` directory.

b.) Simply clone the GitHub repository on your Grafana server: 

```
cd /var/lib/grafana/plugins/
git clone https://github.com/MarioSchuerewegen/grafana-ibm-nci

```
c.) Install the plugin using the Grafana CLI:

```
grafana-cli plugins install ibm-NCI-datasource
```

3). Restart Grafana. On RedHat/Centos run:

`systemctl restart grafana-server`

IBM NCI data source configuration
=================================

Click the Grafana Logo -&gt; Data Sources and click **+Add data source**.

![g1.png](./media/image16.png)

Specify the data source name and select “IBM NCI” from the list.

![g2.png](./media/ds1.png)

Specify the REST API URL:

`http://<NCI_server_hostname>:16311/ibm/tivoli/rest/providers/Impact_NCICLUSTER



 

![domain_override.png](./media/domain_override.png)

Select **Basic Auth** and **With credentials** and specify the user name

-   impactadmin  (default password impactadmin)


Select checkbox "Deallocate dataset after every metric query". It is recommended to have it enabled all the time. Lack of datasource deallocation requests may cause memory leak and OutOfMemory exceptions on NCI .
Disable this option only for testing a new panel query, if you want to use Grafana Query Inspector feature.

The Screen below illustrates the completed configuration for the NCI data source:

![g3.png](./media/ds2.png){

Click **Save & Test**. If the connection is successful, you should see the following
message:

![g4.png](./media/ds3.png)

Click Cancel to exit. Now the data source is configured.

![g7.png](./media/ds5.png)

Troubleshooting
===============

This datasource only has support for "Impact Objects" and "Array of Impact Objects"  datatypes.
these are converted into single row(series) or multi row(series) data sets.
