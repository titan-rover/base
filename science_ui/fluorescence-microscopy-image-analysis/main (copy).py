import imutils
import cv2
import numpy as np
import matplotlib.pyplot as plt


# path = "picture_a.jpg"
# img = cv2.imread(path)
# resized = imutils.resize(img, width=900)
# ratio = img.shape[0] / float(resized.shape[0])
# gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

# (ret, thresh) = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
# edge = cv2.Canny(thresh, 100, 200)
# cnts, hierarchy = cv2.findContours(edge.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# for c in cnts:
#     rect = cv2.minAreaRect(c)
#     box = cv2.boxPoints(rect)
#     box = np.int0(box)
#     area = cv2.contourArea(c)
#     if area > 1:
#         cv2.drawContours(resized,[box],0,(0,0,255),2)
#         cv2.drawContours(resized, [c], -1, (0, 255, 0), 2)
#         #print("area : "+str(area))
#         #print('\nContours: ' + str(c[0]))
#         #img[c[0]]
#         pixelpoints = np.transpose(np.nonzero(c))
#         #print('\pixelpoints: ' + str(pixelpoints))

#         #  accessed the center of the contour using the followi
#         M = cv2.moments(c)
#         if M["m00"] != 0:
#             cX = int((M["m10"] / M["m00"]) * ratio)
#             cY = int((M["m01"] / M["m00"]) * ratio)
#             #print (cX,cY)

#             cord = img[int(cX)+3,int(cY)+3]
#             print(cord)


# cv2.imshow("Output", resized)
# cv2.waitKey(0)
# exit()

# img = cv2.imread("picture_a.jpg")
# resized = imutils.resize(img, width=900)
# ratio = img.shape[0] / float(resized.shape[0])
# gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

# ret, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
# cnts, hierarchy= cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# # if you want cv2.contourArea >1, you can just comment line bellow
# cnts = np.array(cnts)[[cv2.contourArea(c)>10 for c in cnts]]
# grains = [np.int0(cv2.boxPoints(cv2.minAreaRect(c))) for c in cnts]
# centroids =[(grain[2][1]-(grain[2][1]-grain[0][1])//2, grain[2][0]-(grain[2][0]-grain[0][0])//2) for grain in grains]

# colors = [resized[centroid] for centroid in centroids]
# cv2.drawContours(img, cnts, -1, (0, 255, 0), 3)
# print(colors)
# cv2.imshow("output", img)
# cv2.waitKey(0)
# exit()

# img = cv2.imread('picture_a.jpg', 0)

# #Thresh
# ret, thresh = cv2.threshold(img, 200, 255, cv2.THRESH_BINARY)

# #Finding the contours in the image
# contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# #Convert img to RGB and draw contour
# img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
# cv2.drawContours(img, contours, -1, (0,0,255), 2)
# cv2.imshow("output", img)
# cv2.waitKey(0)
# exit()

# Read the image
# img=cv2.imread('picture_a.jpg')

# # Convert to Gray
# imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# # Apply threshold and Dilate (to bring out the lines of the plane)
# ImgThresh = cv2.threshold(imgGray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
# ImgThreshDilation = cv2.dilate(ImgThresh,(3,3),iterations = 2)

# # Find edges
# imgEdges = cv2.Canny(ImgThreshDilation,100,200)

# # Find contour
# contours,hierarchy =cv2.findContours(imgEdges,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE) 

# # Loop through contours and find the two biggest area.
# for cont in contours:
#     area=cv2.contourArea(cont)
#     if area>300:
#         #print(area)
#         cv2.drawContours(img,cont,-1,(0,0,255),2)

# cv2.imshow('Image with planes in Red',img)
# cv2.waitKey(0)


# Read the image
# img=cv2.imread('picture_a.jpg')
# imgCont=img.copy()

# # Convert to Gray
# imgGray =255- cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# # Find edges
# imgEdges = cv2.Canny(imgGray,150,200)

# # Find contour
# contours,hierarchy =cv2.findContours(imgEdges,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE) 

# # Loop through contours and find the two biggest area.
# for cont in contours:
#     area=cv2.contourArea(cont)
#     if area>150:
#         #print(area)
#         cv2.drawContours(imgCont,cont,-1,(0,0,255),5)

# # Save your pictures with the contour in red
# cv2.imwrite('Image with planes in Red.jpg',imgCont)

# image = cv2.imread("picture_a.jpg")

# # convert to RGB
# image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# # convert to grayscale
# gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

# # create a binary thresholded image
# _, binary = cv2.threshold(gray, 225, 255, cv2.THRESH_BINARY_INV)
# # show it
# plt.imshow(binary, cmap="gray")
# plt.show()

# im_gray = cv2.imread('picture_a', cv2.IMREAD_GRAYSCALE)
# (thresh, im_bw) = cv2.threshold(im_gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
# thresh = 127
# im_bw = cv2.threshold(im_gray, thresh, 255, cv2.THRESH_BINARY)[1]
# cv2.imwrite('picture_a', im_bw)

image = cv2.imread('picture_a.jpg')

#Get the green (https://stackoverflow.com/questions/47483951/how-to-define-a-threshold-value-to-detect-only-green-colour-objects-in-an-image)
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
# mask = cv2.inRange(hsv, (36,25,25), (70, 255, 255))
# immask = mask > 0
# green = np.zeros_like(image, np.uint8)
# green[mask] = image[mask]
#Get the greens

low_green = np.array([25, 52, 72])
high_green = np.array([102, 255, 255])
green_mask = cv2.inRange(hsv, low_green, high_green)
green = cv2.bitwise_and(image, image, mask=green_mask)

# green = cv2.cvtColor(green, cv2.COLOR_BGR2RGB)
imgray = cv2.cvtColor(green, cv2.COLOR_BGR2GRAY)
# ret, thresh = cv2.threshold(imgray, 150, 255, cv2.THRESH_BINARY_INV)
th = cv2.adaptiveThreshold(imgray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 115, 1)
contours, hierarchy = cv2.findContours(th, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
cv2.drawContours(green, contours, -1, (0,255,0), 3)
cv2.imshow('Output', green)
cv2.waitKey(0)