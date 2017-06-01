# Copyright (c) Microsoft Corporation.  All rights reserved.

# Third Party Programs. This software enables you to obtain software applications from other sources. 
# Those applications are offered and distributed by third parties under their own license terms.
# Microsoft is not developing, distributing or licensing those applications to you, but instead, 
# as a convenience, enables you to use this software to obtain those applications directly from 
# the application providers.
# By using the software, you acknowledge and agree that you are obtaining the applications directly
# from the third party providers and under separate license terms, and that it is your responsibility to locate, 
# understand and comply with those license terms.
# Microsoft grants you no license rights for third-party software or applications that is obtained using this software.

#
# WARNINGS:   
#
# CREATION DATE: 24/7/2016
#
# LAST UPDATE: 08/01/2017
#
# VERSION: 1.0.2
#
# R VERSION TESTED: 3.2.2
# 
# AUTHOR: pbicvsupport@microsoft.com
#
# REFERENCES: http://www.exponentialsmoothing.net/


fileRda = "C:/Users/boefraty/projects/PBI/R/tempData.Rda"
if(file.exists(dirname(fileRda)))
{
  if(Sys.getenv("RSTUDIO")!="")
    load(file= fileRda)
  else
    save(list = ls(all.names = TRUE), file=fileRda)
}


Sys.setlocale("LC_ALL","English") # Internationalization 

############ User Parameters #########

##PBI_PARAM: Should warnings text be displayed?
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
showWarnings=TRUE




##PBI_PARAM: Show cumulative value inside shown period (actual + predicted)?
#Type:logical, Default:FALSE, Range:NA, PossibleValues:NA, Remarks: NA
showInfoCumSum = FALSE
if(exists("settings_info_params_showInfoCumSum"))
  showInfoCumSum = settings_info_params_showInfoCumSum

##PBI_PARAM: Show TBATS method selected
#Type:logical, Default:FALSE, Range:NA, PossibleValues:NA, Remarks: NA
showInfoMethodTBATS = FALSE
if(exists("settings_info_params_showInfoMethodTBATS"))
  showInfoMethodTBATS = settings_info_params_showInfoMethodTBATS


##PBI_PARAM: Show information criterion of the found model
#Type:logical, Default:FALSE, Range:NA, PossibleValues:NA, Remarks: NA
showInfoCriterion = FALSE
if(exists("settings_info_params_showInfoCriterion"))
  showInfoCriterion = settings_info_params_showInfoCriterion


showInfo=any(c(showInfoCumSum,showInfoCriterion, showInfoMethodTBATS))

##PBI_PARAM: Forecast length
#Type:integer, Default:NULL, Range:NA, PossibleValues:NA, Remarks: NULL means choose forecast length automatically
forecastLength=500
if(exists("settings_forecastPlot_params_forecastLength"))
{
  forecastLength = as.numeric(settings_forecastPlot_params_forecastLength)
  if(is.na(forecastLength))
    forecastLength = 10
  forecastLength = round(max(min(forecastLength,1e+6),1))
}

##PBI_PARAM: Number of data points in smaller season period
#Type:integer, Default:NULL, Range:NA, PossibleValues:NA, Remarks: NULL means choose forecast length automatically
freq1=1
if(exists("settings_forecastPlot_params_freq1"))
{
  freq1 = as.numeric(settings_forecastPlot_params_freq1)
  if(is.na(freq1))
    freq1 = 1
  freq1 = round(max(min(freq1,1e+6),1))
}

##PBI_PARAM: Number of data points in larger season period
#Type:integer, Default:NULL, Range:NA, PossibleValues:NA, Remarks: NULL means choose forecast length automatically
freq2=1
if(exists("settings_forecastPlot_params_freq2"))
{
  freq2 = as.numeric(settings_forecastPlot_params_freq2)
  if(is.na(freq2))
    freq2 = 1
  freq2 = round(max(min(freq2,1e+6),1))
}
# freq1 = 96 
# freq2 = 672 




confInterval1 = 0.5
if (exists("settings_conf_params_confInterval1")) 
{ 
  confInterval1 = as.numeric(settings_conf_params_confInterval1)
  if(is.na(confInterval1))
    confInterval1 = 0.5
}
confInterval2 = 0.995
if (exists("settings_conf_params_confInterval2")) 
{ 
  confInterval2 = as.numeric(settings_conf_params_confInterval2)
  if(is.na(confInterval2))
    confInterval1 = 0.995
}

if(confInterval1>confInterval2)
{
  temp = confInterval2
  confInterval2 = confInterval1
  confInterval1 = temp
}

lowerConfInterval = confInterval1
upperConfInterval = confInterval2

showFromTo = "mday"# 
if(exists("settings_graph_params_showFromTo"))
  showFromTo = settings_graph_params_showFromTo

possibleFromTo = c('all','hour','mday','week','mon','year')

if(!(showFromTo %in% possibleFromTo))
  showFromTo = possibleFromTo[1]

showInPlotFitted = FALSE
if(exists("settings_graph_params_showInPlotFitted"))
  showInPlotFitted = settings_graph_params_showInPlotFitted


valuesNonNegative = FALSE
if(exists("settings_additional_params_valuesNonNegative"))
  valuesNonNegative = settings_additional_params_valuesNonNegative

algModeFast = FALSE
if(exists("settings_additional_params_algModeFast"))
  algModeFast = settings_additional_params_algModeFast


userDateFormat = "auto" # 



###############Library Declarations###############

libraryRequireInstall = function(packageName, ...)
{
  if(!require(packageName, character.only = TRUE)) 
    warning(paste("*** The package: '", packageName, "' was not installed ***",sep=""))
}

#ets
libraryRequireInstall("graphics")
libraryRequireInstall("scales")
libraryRequireInstall("forecast")
libraryRequireInstall("zoo")
libraryRequireInstall("ggplot2")
libraryRequireInstall("lubridate")

###############Internal parameters definitions#################

#PBI_PARAM Minimal number of points
#Type:integer, Default:7, Range:[0,], PossibleValues:NA, Remarks: NA
minPoints = 7

##PBI_PARAM Color of time series line
#Type:string, Default:"orange", Range:NA, PossibleValues:"orange","blue","green","black"
pointsCol = "orange"
if(exists("settings_graph_params_dataCol"))
  pointsCol = settings_graph_params_dataCol

##PBI_PARAM Color of forecast line
#Type:string, Default:"red", Range:NA, PossibleValues:"red","blue","green","black"
forecastCol = "red"
if(exists("settings_graph_params_forecastCol"))
  forecastCol = settings_graph_params_forecastCol


fittedCol = "green"
if(exists("settings_graph_params_fittedCol"))
  fittedCol = settings_graph_params_fittedCol

#PBI_PARAM Transparency of scatterplot points
#Type:numeric, Default:0.4, Range:[0,1], PossibleValues:NA, Remarks: NA
transparency = 1
if(exists("settings_graph_params_percentile"))
  transparency = as.numeric(settings_graph_params_percentile)/100

#PBI_PARAM Shaded band for confidence interval
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
fillConfidenceLevels=TRUE

#PBI_PARAM damping
#Type:logical, Default: NULL, Remarks: NULL selects damped or undamped trend depending on which fits better
damped = NULL
if(exists("settings_forecastPlot_params_dampingType"))
{
  damped = as.logical(settings_forecastPlot_params_dampingType)
  if(is.na(damped))
    damped=NULL
}

#PBI_PARAM Size of points on the plot
#Type:numeric, Default: 1 , Range:[0.1,5], PossibleValues:NA, Remarks: NA
pointCex = 1
if(exists("settings_graph_params_weight"))
  pointCex = as.numeric(settings_graph_params_weight)/10

#PBI_PARAM Size of subtitle on the plot
#Type:numeric, Default: 0.75 , Range:[0.1,5], PossibleValues:NA, Remarks: NA
cexSub = 0.75
if(exists("settings_info_params_textSize"))
  cexSub = as.numeric(settings_info_params_textSize)/12

##PBI_PARAM Color of info text
#Type:string, Default:"red", Range:NA, PossibleValues:"red","blue","green","black"
infoTextCol = "gray50"
if(exists("settings_info_params_infoTextCol"))
  infoTextCol = settings_info_params_infoTextCol

#PBI_PARAM Size of labels on axes
#Type:numeric , Default:12, Range:NA, PossibleValues:[1,50], Remarks: NA
sizeLabel = 12

#PBI_PARAM Size of warnings font
#Type:numeric , Default:cexSub*12, Range:NA, PossibleValues:[1,50], Remarks: NA
sizeWarn = cexSub*12

#PBI_PARAM Size of ticks on axes 
sizeTicks = 8

#PBI_PARAM opacity of conf interval color
transparencyConfInterval = 0.3 



###############Internal functions definitions#################

# tiny function to deal with verl long strings on plot
cutStr2Show = function(strText, strCex = 0.8, abbrTo = 100, isH = TRUE, maxChar = 3, partAvailable = 1)
{
  # partAvailable, wich portion of window is available, in [0,1]
  if(is.null(strText))
    return (NULL)
  
  SCL = 0.075*strCex/0.8
  pardin = par()$din
  gStand = partAvailable*(isH*pardin[1]+(1-isH)*pardin[2]) /SCL
  
  # if very very long abbreviate
  if(nchar(strText)>abbrTo && nchar(strText)> 1)
    strText = abbreviate(strText, abbrTo)
  
  # if looooooong convert to lo...
  if(nchar(strText)>round(gStand) && nchar(strText)> 1)
    strText = paste(substring(strText,1,floor(gStand)),"...",sep="")
  
  # if shorter than maxChar remove 
  if(gStand<=maxChar)
    strText = NULL
  
  return(strText) 
}


# verify if "perSeason" is good for "frequency" parameter
freqSeason = function(seasons,perSeason)
{
  if((seasons > 5 && perSeason > 3) || (seasons>2 && perSeason > 7))
    return (perSeason)
  
  return(1)
}

# find frequency using the dates, targetS is a "recommended" seasonality 
findFreq = function(dates, targetS = "Automatic")
{
  freq = 1
  N = length(dates)
  nnn = c("Minute","Hour", "Day", "Week", "Month", "Quater", "Year")
  seasons = rep(NaN,7)
  names(seasons) = nnn
  perSeason = seasons
  
  seasons["Day"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="days"))
  seasons["Hour"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="hours"))
  seasons["Minute"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="mins"))
  seasons["Week"]=round(as.numeric(difftime(dates[length(dates)],dates[1]),units="weeks"))
  seasons["Month"] = seasons["Day"]/30
  seasons["Year"] = seasons["Day"]/365.25
  seasons["Quater"] = seasons["Year"]*4
  
  perSeason = N/seasons
  
  if(targetS!="Automatic") # target 
    freq = perSeason[targetS]
  
  if(freq < 2 || round(freq)>24) # if TRUE, target season factor is not good 
    freq = 1
  
  for( s in rev(nnn)) # check year --> Quater --> etc
    if(freq==1 || round(freq)>24)
      freq = freqSeason(seasons[s],perSeason[s])
  
  
  if(round(freq)>24) # limit of exp smoothing R implementation
    freq = 1
  
  return(freq)
}



# Find number of ticks on X axis 
FindTicksNum = function(n,f)
{
  tn = 10 # default minimum
  D = 2 # tick/inch
  numCircles = n/f
  xSize = par()$din[1]
  tn = max(round(xSize*D),tn)
  return(tn) 
}

#format labels on X-axis automatically 
flexFormat = function(dates, orig_dates, freq = 1, myformat = NULL)
{
  
  days=(as.numeric(difftime(dates[length(dates)],dates[1]),units="days"))
  months = days/30
  years = days/365.25
  
  
  constHour = length(unique(orig_dates$hour))==1
  constMin = length(unique(orig_dates$min))==1
  constSec = length(unique(orig_dates$sec))==1
  constMon = length(unique(orig_dates$mon))==1
  
  timeChange = any(!constHour,!constMin,!constSec)
  
  if(is.null(myformat))
  {
    if(years > 10){
      if(constMon)
      {
        myformat = "%Y" #many years => only year :2001
      }else{
        myformat = "%m/%y" #many years + months :12/01
      }
    }else{
      if(years > 1 && N < 50){
        myformat = "%b %d, %Y" #several years, few samples:Jan 01, 2010
      }else{
        if(years > 1){
          myformat = "%m/%d/%y" #several years, many samples: 01/20/10
        }else{
          if(years <= 1 && !timeChange)
            myformat = "%b %d" #1 year,no time: Jan 01
        }  
      }
    }
  }
  if(is.null(myformat) && timeChange)
    if(years>1){
      myformat = "%m/%d/%y %H:%M" # 01/20/10 12:00
    }else{
      if(days>1){
        myformat = "%b %d, %H:%M" # Jan 01 12:00
      }else{
        if(days<=1){
          myformat = "%H:%M" # Jan 01 12:00
        }  
      }
    }
  if(!is.null(myformat)){
    if(myformat == "%Y,Q%q")
      dates = as.yearqtr(dates)
    dates1= format(dates,  myformat)
  }else{
    dates1 = as.character(1:length(dates)) # just id 
  }
  return(dates1)
}

joinFreq = function (f1 ,f2 = NULL)
{
  if(is.null(f1) || is.na(f1) || f1 < 1)
    f1 = NULL
  if(is.null(f2) || is.na(f2) || f2 < 1)
    f2 = NULL
  
  f = unique(c(f1,f2))
  if(is.null(f) || is.na(f) || f < 1)
    f = 1
  
  return(f)
  
}


indexShowFromTo = function(showFromTo,datesActual, datesAll)
{
  Lall = length(datesAll)
  Lactual = length(datesActual)
  
  if(showFromTo == "all")
  {
  frto = c(1,Lall)
  return(frto)
  }
  
  if(showFromTo == "hour")
  {
    v = datesAll$hour
    target = v[Lactual]
  }
  
  if(showFromTo == "mday")
  {
    v = datesAll$mday
    target = v[Lactual]
  }
  if(showFromTo == "mon")
  {
    v = datesAll$mon
    target = v[Lactual]
  }
  if(showFromTo == "year")
  {
    v = datesAll$year
    target = v[Lactual]
  }
  
  if(showFromTo == "week")
  {
    
    v = lubridate::week(datesAll)
    target = v[Lactual]
  }
  
  
  fr = Lactual
  # go backward 
  for (i in rev(1:Lactual))
  {
    if(v[i] == target)
      fr = i
    else
      break;
  }
  
  to = Lactual
  # go forward 
  for (i in (Lactual:Lall))
  {
    if(v[i] == target)
      to = i
    else
      break;
  }
  frto = c(fr,to)
  
  return(frto)
  
}


###############Upfront input correctness validations (where possible)#################

pbiWarning = NULL



if(!exists("Date") || !exists("Value"))
{
  dataset=data.frame()
  pbiWarning  = cutStr2Show("Both 'Date' and 'Value' fields are required.", strCex = 0.85)
  timeSeries=ts()
  showWarnings=TRUE
}else{
  dataset= cbind(Date,Value)
  dataset<-dataset[complete.cases(dataset),] #remove corrupted rows
  labTime = "Time"
  labValue=names(dataset)[ncol(dataset)]
  
  # dataset = dataset[-nrow(dataset),]
  # dataset = dataset[-nrow(dataset),]
  # dataset = dataset[-nrow(dataset),]
  
  N=nrow(dataset)
  
  if(N==0 && exists("Date") && nrow(Date)>0 &&  exists("Value")){
    pbiWarning1  = cutStr2Show("Wrong date type. Only 'Date', 'Time', 'Date/Time' are allowed without hierarchy", strCex = 0.85)
    pbiWarning = paste(pbiWarning1, pbiWarning, sep ="\n")
    timeSeries=ts()
    showWarnings=TRUE
  }else {
    
    dataset = dataset[order(dataset[,1]),]
    parsed_dates=strptime(dataset[,1],"%Y-%m-%dT%H:%M:%S",tz="UTC")
    labTime = names(Date)[1]
    
    if((any(is.na(parsed_dates))))
    {
      pbiWarning1  = cutStr2Show("Wrong or corrupted 'Date'.", strCex = 0.85)
      pbiWarning2  = cutStr2Show("Only 'Date', 'Time', 'Date/Time' types are allowed without hierarchy", strCex = 0.85)
      pbiWarning = paste(pbiWarning1, pbiWarning2, pbiWarning, sep ="\n")
      timeSeries=ts()
      showWarnings=TRUE
    }
    else
    {
      
      interval = difftime(parsed_dates[length(parsed_dates)],parsed_dates[1])/(length(parsed_dates)-1) # force equal spacing 
      myFreq = findFreq(parsed_dates, targetS = 1)
      timeSeries=ts(data = dataset[,2], start=1, frequency = round(myFreq))
    }
  }
}
##############Main Visualization script###########

pbiInfo = NULL


if(length(timeSeries)>=minPoints) {
  

  
  # compute part of dates to show
  actTimes = as.POSIXlt(seq(from=parsed_dates[1], to = parsed_dates[length(parsed_dates)], length.out = length(parsed_dates)))
  allTimes = as.POSIXlt(seq(from=parsed_dates[1], to = (parsed_dates[1]+interval*(length(parsed_dates)+forecastLength)), length.out = length(parsed_dates)+forecastLength))
  fFromTo = indexShowFromTo(showFromTo,actTimes, allTimes)
  myInclude = length(actTimes) - fFromTo[1]
  myForecastLength = min(forecastLength,fFromTo[2] - length(actTimes)) 
  
  if(myForecastLength == 0)# need to forecast next day/week/etc
  {
    actTimes1 = allTimes[1:(length(actTimes)+1)]
    fFromTo = indexShowFromTo(showFromTo,actTimes1, allTimes)
    myInclude = 0
    myForecastLength = min(forecastLength,fFromTo[2] - length(actTimes)) + 1
  }
  
  numPo = myInclude + myForecastLength
  
   d <- freq1 #daily seasonality
   w <- freq2 #weekly seasonality
   
   startC <- 1/freq2 #starting point for axis
   finishC <- numPo/freq2 #end point for axis
   
   
   freqs = joinFreq(freq1,freq2)
   
   #calculate how many periods to forecast assuming the first row starts a new day
   l <- N # length(dataset[,2]) #how many intervals in the data
   a <- myInclude #the number of rows to include from actuals
   f <- myForecastLength #number of periods to forecast 
   y <- msts(dataset[,2], seasonal.periods=c(d, w), start= (-N+myInclude)/freq2 )#+d/w)
   
  
   timeSeries=msts(data = dataset[,2], seasonal.periods=freqs, start= -l/w +a/w)
   timeSeries = y
   

   
   if(algModeFast)
     fit <- tbats(timeSeries, use.box.cox = FALSE, use.trend = FALSE, use.damped.trend = FALSE,
                  use.arma.errors = FALSE, max.p= 2, max.q = 2,
                  max.P = 1, max.Q = 1, max.order= 3, max.d = 1, max.D = 0 )
    else
      fit <- tbats(timeSeries) 
   
   # fit <- tbats(timeSeries, use.box.cox=FALSE, use.trend= TRUE, use.damped.trend = FALSE,
   #              use.arma.errors=TRUE, use.parallel= TRUE,
   #              num.cores= NULL, bc.lower=0, bc.upper=1, biasadj=FALSE)
   # 
   
   if(lowerConfInterval==0)
     lowerConfInterval = NULL; 
   
  if (is.null(forecastLength))
    prediction = forecast(fit, level=c(lowerConfInterval,upperConfInterval))
  else
    prediction = forecast(fit, level=c(lowerConfInterval,upperConfInterval), h=myForecastLength)
  
  # lastValue = tail(prediction$x,1)
  # 
  # prediction$mean=ts(c(lastValue,prediction$mean), 
  #                    frequency = frequency(prediction$mean), 
  #                    end=end(prediction$mean))
  # 
  # prediction$upper=ts(rbind(c(lastValue,lastValue),prediction$upper), 
  #                     frequency = frequency(prediction$upper), 
  #                     end=end(prediction$upper))
  # 
  # prediction$lower=ts(rbind(c(lastValue,lastValue),prediction$lower), 
  #                     frequency = frequency(prediction$lower), 
  #                     end=end(prediction$lower))
  
   
   if(valuesNonNegative)
   {
     prediction$mean[prediction$mean < 0] = 0
     prediction$upper[prediction$upper<0] = 0
     prediction$lower[prediction$lower<0] = 0
     prediction$fitted[prediction$fitted<0] = 0
     
   }
     
  tempVal = sum(dataset[fFromTo[1]:N,2])
  if(is.na(tempVal))
    tempVal = 0
   myCumSum = sum(prediction$mean) + tempVal
   
   
   
  if(showInfo && showInfoMethodTBATS)
    pbiInfo=paste(pbiInfo,"", prediction$method, ". ",sep="")
  
   if(showInfoCumSum)
     pbiInfo=paste(pbiInfo, "Cumulative forecast: ", format(myCumSum, digits=3, nsmall=2),". ", sep="")
   
   if(showInfoCriterion)
     pbiInfo=paste(pbiInfo, "AIC: ", format(fit$AIC, digits=3, nsmall=2), ". ", sep="")
  
  labTime = cutStr2Show(labTime, strCex =1.1, isH = TRUE)
  labValue = cutStr2Show(labValue, strCex =1.1, isH = FALSE)
  
 
  
  
  plot.forecast(prediction, lwd=pointCex, col=alpha(pointsCol,transparency), fcol=alpha(forecastCol,transparency), flwd = pointCex, shaded=fillConfidenceLevels, 
                main = "", sub = pbiInfo, col.sub = infoTextCol, cex.sub = cexSub, xlab = labTime, ylab = labValue, xaxt = "n", include = myInclude)
  
  
 
 
  
  NpF = myInclude + myForecastLength
 # freq = frequency(timeSeries)
  
  
  #format  x_with_f
  numTicks = FindTicksNum(NpF,max(freqs)) # find based on plot size
  numTicks = min(numTicks, NpF)
  
  fromDate = parsed_dates[length(parsed_dates) - myInclude ]
  toDate =  parsed_dates[1]+interval*(length(parsed_dates)+myForecastLength - 1)
  
 # x_with_f = as.POSIXlt(seq(from=fromDate, to = toDate, length.out = numTicks))
  x_with_f_exist = as.POSIXlt(seq(from=fromDate, to = toDate, by = interval))
  iii = unique(round(seq(from = 1, to = length(x_with_f_exist), length.out = numTicks)))
  x_with_f = x_with_f_exist[iii]
  
  #TODO: find closest x_with_f_exist in x_with_f
  
  x_with_forcast_formatted = flexFormat(dates = x_with_f, orig_dates = parsed_dates, freq = max(freqs))
  
  correction = (NpF-1)/(numTicks-1) # needed due to subsampling of ticks
  axis(1, at = 0+correction*((0:(numTicks-1))/max(freqs)), labels = x_with_forcast_formatted)
 
 
  if(showInPlotFitted)
  {
    lines(prediction$fitted,col = alpha(fittedCol,transparency), lty = 2, lwd = pointCex*0.75)
  }
  
  
  
  
  
  
  
  
  
} else{ #empty plot
  plot.new()
  showWarnings = TRUE
  pbiWarning<-paste(pbiWarning, "Not enough data points", sep="\n")
}

#add warning as subtitle
if(showWarnings)
  title(main=NULL, sub=pbiWarning,outer=FALSE, col.sub = "gray50", cex.sub=cexSub)

#remove("dataset")