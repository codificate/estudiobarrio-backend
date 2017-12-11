<!DOCTYPE html>
<html ng-app="app">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Favicon icon -->
    <!-- link rel="icon" type="image/png" sizes="16x16" href="../assets/images/favicon.png" -->
    <title>OneProp</title>
    <!-- Bootstrap Core CSS -->
    <link href="assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="node_modules/ng-dialog/css/ngDialog.min.css" rel="stylesheet" >
    <link href="node_modules/ng-dialog/css/ngDialog-theme-default.min.css" rel="stylesheet" >
    <link href="node_modules/ng-table/bundles/ng-table.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
    <!-- You can change the theme colors from here -->
    <link href="assets/css/colors/default-dark.css" id="theme" rel="stylesheet">
    <link href="node_modules/angular-material/angular-material.min.css" rel="stylesheet" >
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="node_modules/angular-jk-carousel/dist/jk-carousel.min.css" rel="stylesheet" >
    <link href="node_modules/sweetalert/lib/sweet-alert.css" rel="stylesheet" type="text/css">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="assets/js/html5shiv.js"></script>
    <script src="assets/js/respond.min.js"></script>
    <![endif]-->

    <style type="text/css">
      .detail .detailicon{ opacity: 0; }
      .detail:hover .detailicon{
        opacity: 1;
        cursor: pointer;
        display: inline-block;
      }
      md-card {
        margin: auto;
        left: 0;
        right: 0;
        margin-bottom: 20px;
      }
    </style>

</head>

<body>

    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->
    <section id="wrapper">

        <ui-view></ui-view>

    </section>

    <!-- ============================================================== -->
    <!-- End Wrapper -->
    <!-- ============================================================== -->

    <!-- angular scripts -->
    <script src="node_modules/angular/angular.js"></script>
    <script src="node_modules/angular-animate/angular-animate.js"></script>
    <script src="node_modules/angular-touch/angular-touch.js"></script>
    <script src="node_modules/angular-sanitize/angular-sanitize.js"></script>
    <script src="node_modules/ng-dialog/js/ngDialog.min.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="node_modules/angular-messages/angular-messages.js"></script>
    <script src="node_modules/ngstorage/ngStorage.js"></script>
    <script src="node_modules/lodash/lodash.js"></script>
    <script src="node_modules/angular-aria/angular-aria.min.js"></script>
    <script src="node_modules/angular-material/angular-material.min.js"></script>
    <script src="node_modules/angular-jk-carousel/dist/jk-carousel.min.js"></script>
    <script src="node_modules/ng-table/bundles/ng-table.min.js"></script>
    <script src="node_modules/angular-sweetalert/SweetAlert.min.js"></script>
    <script src="node_modules/sweetalert/lib/sweet-alert.min.js"></script>


    <!-- application scripts -->
    <script src="app.js"></script>
    <script src="services/authentication.service.js"></script>
    <script src="services/reclamos.service.js"></script>
    <script src="services/pagos.service.js"></script>
    <script src="home/reclamos.controller.js"></script>
    <script src="pagos/pagos.controller.js"></script>
    <script src="login/index.controller.js"></script>
    <script src="nuevoreclamo/nuevoreclamo.controller.js"></script>

    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="assets/plugins/jquery/jquery.min.js"></script>
    <!-- Bootstrap tether Core JavaScript -->
    <script src="assets/plugins/bootstrap/js/tether.min.js"></script>
    <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
    <!-- slimscrollbar scrollbar JavaScript -->
    <script src="assets/js/jquery.slimscroll.js"></script>
    <!--Wave Effects -->
    <script src="assets/js/waves.js"></script>
    <!--Menu sidebar -->
    <script src="assets/js/sidebarmenu.js"></script>
    <!--stickey kit -->
    <script src="assets/plugins/sticky-kit-master/dist/sticky-kit.min.js"></script>
    <!-- This is data table -->
    <script src="assets/plugins/datatables/jquery.dataTables.min.js"></script>

</body>

</html>
