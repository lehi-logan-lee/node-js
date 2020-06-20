<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
    <title>Document</title>
</head>
<body>
    <div class="jumbotron d-flex align-center">
        <div class="container">
        <div class='row'>
            <div class='col col-xs-4'>
                <h1>Ponder 09</h1>
                <form action="/postage" method="post">
                    <div class="form-group">
                        <label for="width">weight:</label>
                        <input type="text" class="form-control col-xs-4" id="weight" name='weight'>
                    </div>
                    <div class="form-group">
                        <label for="type">Type:</label>
                        <select class="form-control col-xs-4" id="type" name='type'>
                        <option>Letters (Stamped)</option>
                        <option>Letters (Metered)</option>
                        <option>Large Envelopes (Flats)</option>
                        <option>First-Class Package Service—Retail</option>
                        </select>
                    </div> 
                    
                    <button type="submit" class="btn btn-success btn-lg">Check Result</button>
                </form>
            </div>
        </div>
    </div>
    </div>
</body>
</html>