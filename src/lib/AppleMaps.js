import React, { Component } from 'react'

class AppleMaps extends Component {
	componentDidMount() {
		const { children, initialMapType } = this.props
		this.canvas = document.createElement('canvas')
		this.canvas.id = 'currentLocationOverride'
		mapkit.init({
			authorizationCallback: function(done) {
				done(this.props.token)
			}
		})

		this.map = new mapkit.Map('map')
		this.annotations = {}

		// Set initial mapType
		if(initialMapType !== undefined) {
			this.map.mapType = initialMapType
		}

		//	Annotations
		if (children !== undefined && children.length) {
			children.forEach(child => {
				if (child.props.isAnnotation) {
					this.createAnnotation(child.props)
				}
			})
		} else if (children !== undefined && children.props) {
			if (children.props.isAnnotation) {
				this.createAnnotation(children.props)
			}
		}

		//	Image Annotations
		if (children !== undefined && children.length) {
			children.forEach(child => {
				if (child.props.isImageAnnotation) {
					this.createImageAnnotation(child.props)
				}
			})
		} else if (children !== undefined && children.props) {
			if (children.props.isImageAnnotation) {
				this.createImageAnnotation(children.props)
			}
		}

		// Current Location Override
		if (children !== undefined && children.length) {
			children.forEach(child => {
				if (child.type.name === 'CurrentLocationOverride') {
					this.createCurrentLocationOverride(child.props)
				}
			})
		} else if (children !== undefined && children.props) {
			if (children.type.name === 'CurrentLocationOverride') {
				this.createCurrentLocationOverride(children.props)
			}
		}

		//	Set main coords
		this.setMainCoords()
	}

	componentDidUpdate(prevProps) {
		const {
			children,
			latitude,
			longitude,
			spanLat,
			spanLong,
			zoomLevel,
			width,
			height,
			autoAdjust
		} = this.props

		if((
			prevProps.latitude !== latitude ||
			prevProps.longitude !== longitude ||
			prevProps.spanLat !== spanLat ||
			prevProps.spanLong !== spanLong ||
			prevProps.zoomLevel !== zoomLevel ||
			prevProps.width !== width ||
			prevProps.height !== height ||
			prevProps.autoAdjust !== autoAdjust
		) && autoAdjust) {
			this.setMainCoords()
		}

		let currentAnnotationIds = []
		if (children !== undefined && children.length) {
			children.forEach(child => {
				if (child.props.isAnnotation) {
					if(child.props.id) {
						currentAnnotationIds.push(child.props.id)
					}
					this.updateAnnotation(child.props)
				}
			})
		} else if (children !== undefined && children.props) {
			if (children.props.isAnnotation) {
				if(children.props.id) {
					currentAnnotationIds.push(children.props.id)
				}
				this.updateAnnotation(children.props)
			}
		}

		const prevChildren = prevProps.children
		if (prevChildren !== undefined && prevChildren.length) {
			prevChildren.forEach(child => {
				const id = child.props.id
				if(id === undefined) {
					return
				}
				if(child.props.isAnnotation && !currentAnnotationIds.includes(id) && id in this.annotations) {
					this.removeAnnotation(child.props)
				}
			})
		} else if (prevChildren !== undefined && prevChildren.props) {
			const child = prevChildren
			const id = child.props.id
			if(id === undefined) {
				return
			}
			if(child.props.isAnnotation && !currentAnnotationIds.includes(id) && id in this.annotations) {
				this.removeAnnotation(child.props)
			}
		}

		let checkCurrentLocationLatitudeChange, checkCurrentLocationLongitudeChange, checkCurrentLocationDirectionChange
		if (typeof children !== 'undefined') {
			const firstChild = children[0] ? children[0] : children
			const prevFirstChild = prevProps.children[0] ? prevProps.children[0] : prevProps.children
			if(firstChild.props && prevFirstChild.props) {
				checkCurrentLocationLatitudeChange = firstChild.props.latitude !== prevFirstChild.props.latitude
				checkCurrentLocationLongitudeChange = firstChild.props.longitude !== prevFirstChild.props.longitude
				checkCurrentLocationDirectionChange = firstChild.props.direction !== prevFirstChild.props.direction
			} else if(firstChild.props && !prevFirstChild.props) {
				checkCurrentLocationLatitudeChange = true
				checkCurrentLocationLongitudeChange = true
				checkCurrentLocationDirectionChange = true
			}
		}
		if (
			checkCurrentLocationLatitudeChange ||
			checkCurrentLocationLongitudeChange ||
			checkCurrentLocationDirectionChange
		) {
			if (children !== undefined && children.length) {
				children.forEach(child => {
					if (child.type.name === 'CurrentLocationOverride') {
						this.updateCurrentLocationOverride(child.props)
					}
				})
			} else if (children !== undefined && children.props) {
				if (children.type.name === 'CurrentLocationOverride') {
					this.updateCurrentLocationOverride(children.props)
				}
			}
		}
	}

	createAnnotation(annotationOptions) {
		const {
			id,
			longitude,
			latitude,
			color,
			glyphText,
			glyphImage,
			selected,
			title,
			subtitle,
			visible
		} = annotationOptions
		let MarkerAnnotation = mapkit.MarkerAnnotation
		let coords = new mapkit.Coordinate(latitude, longitude)
		let newAnnotation = new MarkerAnnotation(coords, {
			color,
			title,
			subtitle,
			selected,
			visible
		})
		glyphText ? (newAnnotation.glyphText = glyphText) : ''
		glyphImage ? (newAnnotation.glyphImage = { 1: glyphImage }) : ''
		if(id) {
			this.annotations[id] = newAnnotation
		} else {
			console.warn("Apple MapKitJS annotation created without id prop!")
		}
		this.map.addAnnotation(newAnnotation)
	}

	updateAnnotation(annotationOptions) {
		const {
			id,
			latitude,
			longitude
		} = annotationOptions

		if(id === undefined) {
			return
		}

		if(!(id in this.annotations)) {
			this.createAnnotation(annotationOptions)
			return
		}
		let annotation = this.annotations[id]
		if(latitude !== annotation.coordinate.latitude || longitude !== annotation.coordinate.longitude) {
			annotation.coordinate = new mapkit.Coordinate(latitude, longitude)
		}
	}

	removeAnnotation(annotationOptions) {
		const { id } = annotationOptions

		if(id === undefined) {
			return
		}
		if(!(id in this.annotations)) {
			return
		}

		this.map.removeAnnotation(this.annotations[id])
		delete this.annotations[id]
	}

	createImageAnnotation(annotationOptions) {
		const {
			longitude,
			latitude,
			url,
			selected,
			title,
			subtitle,
			visible
		} = annotationOptions
		let ImageAnnotation = mapkit.ImageAnnotation
		let coords = new mapkit.Coordinate(latitude, longitude)
		let newAnnotation = new ImageAnnotation(coords, {
			title,
			subtitle,
			selected,
			visible,
			url: { 1: url }
		})
		this.map.addAnnotation(newAnnotation)
	}

	createCurrentLocationOverride(locationOptions) {
		const { longitude, latitude, direction } = locationOptions
		// AppleMaps needs options structured this way
		const options = {
			data: {
				direction: direction
			}
		}
		const coordinate = new mapkit.Coordinate(latitude, longitude)
		this.currentLocation = new mapkit.Annotation(
			coordinate,
			() => {
				let ctx = this.canvas.getContext('2d')
				ctx.beginPath()
				ctx.translate(150, 135)
				ctx.rotate((options.data.direction * Math.PI) / 180)
				ctx.lineCap = 'round'
				ctx.moveTo(0, 7)
				ctx.lineTo(10, 12)
				ctx.lineTo(0, -13)
				ctx.lineTo(-10, 12)
				ctx.lineTo(0, 7)
				ctx.fillStyle = '#08F'
				ctx.strokeStyle = '#08F'
				ctx.stroke()
				ctx.fill()
				return this.canvas
			},
			options
		)
		this.map.showItems([this.currentLocation])
	}

	updateCurrentLocationOverride(locationOptions) {
		const { longitude, latitude } = locationOptions
		const coordinate = new mapkit.Coordinate(latitude, longitude)
		this.currentLocation.coordinate = coordinate
	}

	setMainCoords() {
		const { longitude, latitude, spanLat, spanLong } = this.props
		this.map.region = new mapkit.CoordinateRegion(
			new mapkit.Coordinate(latitude, longitude),
			new mapkit.CoordinateSpan(spanLat ? spanLat : this.zoomLevel(), spanLong ? spanLong : this.zoomLevel())
		)
	}

	zoomLevel() {
		const { zoomLevel } = this.props
		switch (zoomLevel) {
			case 0:
				return 300
			case 1:
				return 75
			case 2:
				return 18.75
			case 3:
				return 4.68
			case 4:
				return 1.17
			case 5:
				return 0.39
			case 6:
				return 0.073
			case 7:
				return 0.018
			case 8:
				return 0.0045
			default:
				return 0.35
		}
	}

	render() {
		const { width, height } = this.props
		return (
			<div
				id='map'
				style={{
					width: width,
					height: height
				}}
			/>
		)
	}
}

AppleMaps.defaultProps = {
	width: '100wh',
	height: '100vh',
	zoomLevel: 6,
	longitude: 53.8008,
	latitude: -1.5491,
	autoAdjust: false
}

export default AppleMaps
